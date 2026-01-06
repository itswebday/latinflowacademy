import { DEFAULT_LOCALE } from "@/constants";
import config from "@/payload.config";
import { getCollection } from "@/utils/collections";
import type { LocaleOption } from "@/types";
import { handleApiError } from "@/utils/errors";
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

// Maximum submission data size (in bytes)
const MAX_SUBMISSION_SIZE = 100000; // 100KB
// Maximum number of fields
const MAX_FIELDS = 50;
// Maximum field value length
const MAX_FIELD_VALUE_LENGTH = 10000;

// Basic rate limiting (in-memory, for production use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

// Sanitize string input
const sanitizeString = (input: string): string => {
  if (typeof input !== "string") return "";
  // Remove null bytes and trim
  return input.replace(/\0/g, "").trim().slice(0, MAX_FIELD_VALUE_LENGTH);
};

// Validate submission data against form structure
const validateSubmissionData = (
  submissionData: Array<{ field: string; value: string }>,
  formFields: Array<{
    name?: string | null;
    type?: string | null;
    required?: boolean | null;
  }>,
): { valid: boolean; error?: string } => {
  if (!Array.isArray(submissionData)) {
    return { valid: false, error: "Submission data must be an array" };
  }

  if (submissionData.length > MAX_FIELDS) {
    return {
      valid: false,
      error: `Maximum ${MAX_FIELDS} fields allowed`,
    };
  }

  // Check total size
  const totalSize = JSON.stringify(submissionData).length;
  if (totalSize > MAX_SUBMISSION_SIZE) {
    return {
      valid: false,
      error: `Submission data exceeds maximum size of ${MAX_SUBMISSION_SIZE} bytes`,
    };
  }

  // Create a map of form fields
  const formFieldsMap = new Map<
    string,
    { type?: string | null; required?: boolean | null }
  >();
  formFields.forEach((field) => {
    if (field.name && field.type && field.type !== "") {
      formFieldsMap.set(field.name, {
        type: field.type,
        required: field.required || false,
      });
    }
  });

  // Validate each submission field
  for (const item of submissionData) {
    if (!item.field || typeof item.field !== "string") {
      return {
        valid: false,
        error: "Each submission item must have a valid field name",
      };
    }

    if (typeof item.value !== "string") {
      return {
        valid: false,
        error: "Each submission item must have a string value",
      };
    }

    // Check if field exists in form
    const formField = formFieldsMap.get(item.field);
    if (!formField) {
      return {
        valid: false,
        error: `Field "${item.field}" is not part of this form`,
      };
    }

    // Validate required fields
    if (formField.required && (!item.value || item.value.trim() === "")) {
      return {
        valid: false,
        error: `Required field "${item.field}" is missing or empty`,
      };
    }

    // Validate field value length
    if (item.value.length > MAX_FIELD_VALUE_LENGTH) {
      return {
        valid: false,
        error: `Field "${item.field}" value exceeds maximum length`,
      };
    }
  }

  // Check that all required fields are present
  for (const [fieldName, fieldConfig] of formFieldsMap.entries()) {
    if (fieldConfig.required) {
      const submittedField = submissionData.find(
        (item) => item.field === fieldName,
      );
      if (
        !submittedField ||
        !submittedField.value ||
        submittedField.value.trim() === ""
      ) {
        return {
          valid: false,
          error: `Required field "${fieldName}" is missing or empty`,
        };
      }
    }
  }

  return { valid: true };
};

// Basic rate limiting
const checkRateLimit = (ip: string): { allowed: boolean; error?: string } => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      error: "Too many requests. Please try again later.",
    };
  }

  record.count++;
  return { allowed: true };
};

// Maximum file size (25MB per file)
const MAX_FILE_SIZE = 25 * 1024 * 1024;
// Maximum total file size (25MB)
const MAX_TOTAL_FILE_SIZE = 25 * 1024 * 1024;
// Maximum number of files per field
const MAX_FILES_PER_FIELD = 5;
// Allowed file types
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const POST = async (req: NextRequest) => {
  const locale = (req.nextUrl.searchParams.get("locale") ||
    DEFAULT_LOCALE) as LocaleOption;

  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitCheck = checkRateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          data: {
            errors: [
              { message: rateLimitCheck.error || "Rate limit exceeded" },
            ],
          },
        },
        { status: 429 },
      );
    }

    const payload = await getPayload({ config });

    // Check if request contains FormData (file upload) or JSON
    const contentType = req.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");

    let formId: number | null = null;
    let submissionData: Array<{ field: string; value: string }> = [];
    const uploadedFiles: Record<string, number> = {};
    const uploads: Array<{ field: string; files: number[] }> = [];
    let formConfig: any = null;

    if (isFormData) {
      // Handle FormData with files
      const formData = await req.formData();
      const formIdValue = formData.get("form");

      if (!formIdValue) {
        return NextResponse.json(
          { data: { errors: [{ message: "Formulier ID is verplicht" }] } },
          { status: 400 },
        );
      }

      formId =
        typeof formIdValue === "string"
          ? Number(formIdValue)
          : Number(formIdValue);

      // Fetch form configuration to get field-specific limits
      try {
        formConfig = await payload.findByID({
          collection: "forms",
          id: formId,
          locale: locale,
        });
      } catch (error) {
        return NextResponse.json(
          { data: { errors: [{ message: "Formulier niet gevonden" }] } },
          { status: 404 },
        );
      }

      // Group files by field name
      const filesByField: Record<string, File[]> = {};
      const textFields: Record<string, string> = {};

      // First pass: separate files and text fields
      for (const [key, value] of formData.entries()) {
        if (key === "form") continue;

        if (value instanceof File) {
          if (!filesByField[key]) {
            filesByField[key] = [];
          }
          filesByField[key].push(value);
        } else {
          textFields[key] = value.toString();
        }
      }

      // Validate and process files
      for (const [fieldName, files] of Object.entries(filesByField)) {
        // Find the field configuration to get maxNumFiles and maxMBs
        const fieldConfig = formConfig.fields?.find(
          (f: { name?: string | null }) => f.name === fieldName,
        ) as
          | {
              maxNumFiles?: number | null;
              maxMBs?: number | null;
            }
          | undefined;

        const maxNumFiles = fieldConfig?.maxNumFiles || MAX_FILES_PER_FIELD;
        const maxMBs = fieldConfig?.maxMBs || MAX_TOTAL_FILE_SIZE / 1024 / 1024;
        const maxTotalSize = maxMBs * 1024 * 1024; // Convert MB to bytes
        const maxFileSize = maxMBs * 1024 * 1024; // Convert MB to bytes

        // Validate maximum number of files per field
        if (files.length > maxNumFiles) {
          return NextResponse.json(
            {
              data: {
                errors: [
                  {
                    message: `U kunt maximaal ${maxNumFiles} bestand${maxNumFiles !== 1 ? "en" : ""} uploaden voor "${fieldName}". U heeft ${files.length} bestand${files.length !== 1 ? "en" : ""} geselecteerd.`,
                  },
                ],
              },
            },
            { status: 400 },
          );
        }

        // Validate total file size for this field
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > maxTotalSize) {
          return NextResponse.json(
            {
              data: {
                errors: [
                  {
                    message: `De totale grootte van de bestanden voor "${fieldName}" is te groot. Maximum totale grootte is ${maxMBs}MB.`,
                  },
                ],
              },
            },
            { status: 400 },
          );
        }

        // Validate and upload each file
        const uploadedFileIds: number[] = [];
        for (const file of files) {
          // Validate individual file size
          if (file.size > maxFileSize) {
            return NextResponse.json(
              {
                data: {
                  errors: [
                    {
                      message: `Bestand "${file.name}" is te groot. Maximum is ${maxMBs}MB per bestand.`,
                    },
                  ],
                },
              },
              { status: 400 },
            );
          }

          // Validate file type
          if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json(
              {
                data: {
                  errors: [
                    {
                      message: `Bestandstype "${file.type}" is niet toegestaan.`,
                    },
                  ],
                },
              },
              { status: 400 },
            );
          }

          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const mediaResult = await payload.create({
              collection: "media",
              data: {
                alt: `Form submission: ${fieldName} - ${file.name}`,
              },
              file: {
                data: buffer,
                mimetype: file.type,
                name: file.name,
                size: file.size,
              },
            });

            uploadedFileIds.push(mediaResult.id);
          } catch (error) {
            console.error("Error uploading file:", error);
            return NextResponse.json(
              {
                data: {
                  errors: [
                    {
                      message: `Fout bij uploaden van bestand "${file.name}"`,
                    },
                  ],
                },
              },
              { status: 500 },
            );
          }
        }

        // Store file count for this field
        uploadedFiles[fieldName] = uploadedFileIds.length;
        // Store all file IDs for this field
        submissionData.push({
          field: fieldName,
          value: `files:${uploadedFileIds.join(",")}`,
        });
        // Add to uploads array
        uploads.push({
          field: fieldName,
          files: uploadedFileIds,
        });
      }

      // Process text fields
      for (const [key, value] of Object.entries(textFields)) {
        const sanitizedValue = sanitizeString(value);
        submissionData.push({
          field: key,
          value: sanitizedValue,
        });
      }
    } else {
      // Handle JSON (no files)
      const body = await req.json();
      formId = body.form;
      submissionData = body.submissionData;
    }

    // Basic validation
    if (!formId || !submissionData) {
      return NextResponse.json(
        {
          data: {
            errors: [
              { message: "Formulier ID en inzending data zijn verplicht" },
            ],
          },
        },
        { status: 400 },
      );
    }

    // Validate form ID is a number
    const formIdNumber = typeof formId === "number" ? formId : Number(formId);
    if (isNaN(formIdNumber) || formIdNumber <= 0) {
      return NextResponse.json(
        { data: { errors: [{ message: "Ongeldig formulier ID" }] } },
        { status: 400 },
      );
    }

    // Verify form exists (if not already fetched)
    let form;
    if (!formConfig) {
      const forms = await getCollection("forms", locale, {
        filters: [{ field: "id", operator: "equals", value: formIdNumber }],
      });

      if (forms.length === 0) {
        return NextResponse.json(
          { data: { errors: [{ message: "Formulier niet gevonden" }] } },
          { status: 404 },
        );
      }

      form = forms[0];
      formConfig = form;
    } else {
      form = formConfig;
    }

    // Validate submission data structure (skip file fields in validation)
    const nonFileSubmissionData = submissionData.filter(
      (item) => !item.value.startsWith("file:"),
    );
    const validation = validateSubmissionData(
      nonFileSubmissionData,
      form.fields || [],
    );
    if (!validation.valid) {
      return NextResponse.json(
        {
          data: {
            errors: [
              { message: validation.error || "Ongeldige inzending data" },
            ],
          },
        },
        { status: 400 },
      );
    }

    // Sanitize submission data (preserve file references)
    const sanitizedSubmissionData = submissionData.map(
      (item: { field: string; value: string }) => {
        if (item.value.startsWith("file:")) {
          // Preserve file references
          return item;
        }
        return {
          field: sanitizeString(item.field),
          value: sanitizeString(item.value),
        };
      },
    );

    // Save the form submission
    const submissionResult = await payload.create({
      collection: "form-submissions",
      locale: locale,
      data: {
        form: formIdNumber,
        submissionData: sanitizedSubmissionData,
        uploads: uploads.length > 0 ? uploads : undefined,
        submittedAt: new Date().toISOString(),
      } as any,
    });

    // Success response
    return NextResponse.json({ data: submissionResult }, { status: 201 });
  } catch (errorResponse) {
    return handleApiError(errorResponse);
  }
};
