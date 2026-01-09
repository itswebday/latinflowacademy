import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import type { BlockNode, RichText } from "@/types";

type RichTextRendererProps = {
  className?: string;
  richText: RichText;
};

const RichTextRenderer: React.FC<RichTextRendererProps> = async ({
  className,
  richText,
}) => {
  const renderBlockNode = async (
    blockNode: BlockNode,
    index: number,
  ): Promise<React.ReactElement | null> => {
    if (!Array.isArray(richText.root.children)) {
      return null;
    }

    switch (blockNode.type) {
      case "heading": {
        if (
          !Array.isArray(blockNode.children) ||
          blockNode.children.length === 0
        ) {
          return <br key={index} />;
        }

        const tagName = blockNode.tag;
        const indent = blockNode.indent || 0;
        const classes: string[] = [];
        const style: React.CSSProperties = {};

        if (indent > 0) {
          style.paddingLeft = `${indent * 1.5}rem`;
        }

        const children = await Promise.all(
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );

        return React.createElement(
          tagName,
          {
            className: classes.join(" "),
            style: Object.keys(style).length > 0 ? style : undefined,
            key: index,
          },
          children,
        );
      }

      case "paragraph": {
        if (
          !Array.isArray(blockNode.children) ||
          blockNode.children.length === 0
        ) {
          return <br key={index} />;
        }

        const indent = blockNode.indent || 0;
        const classes: string[] = [];
        const style: React.CSSProperties = {};

        if (indent > 0) {
          style.paddingLeft = `${indent * 1.5}rem`;
        }

        const children = await Promise.all(
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );

        return (
          <p
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
            key={index}
          >
            {children}
          </p>
        );
      }

      case "list": {
        const listType = blockNode.listType || blockNode.format;
        const isOrdered = listType === "number" || listType === "ordered";

        const children = await Promise.all(
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );

        return isOrdered ? (
          <ol className="list-decimal pl-6" key={index} start={blockNode.start}>
            {children}
          </ol>
        ) : (
          <ul className="list-disc pl-6" key={index}>
            {children}
          </ul>
        );
      }

      case "listitem": {
        if (
          !Array.isArray(blockNode.children) ||
          blockNode.children.length === 0
        ) {
          return <br key={index} />;
        }

        const indent = blockNode.indent || 0;
        const style: React.CSSProperties = {};
        const classes: string[] = [];

        if (indent > 0) {
          style.paddingLeft = `${indent * 1.5}rem`;
        }

        const children = await Promise.all(
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );

        return (
          <li
            className={classes.join(" ")}
            style={Object.keys(style).length > 0 ? style : undefined}
            key={index}
          >
            {children}
          </li>
        );
      }

      case "quote": {
        if (
          !Array.isArray(blockNode.children) ||
          blockNode.children.length === 0
        ) {
          return <br key={index} />;
        }

        const quoteChildren = await Promise.all(
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );

        return (
          <blockquote
            className={twMerge("pl-4 my-4 italic border-l-4 border-primary/30")}
            key={index}
          >
            {quoteChildren}
          </blockquote>
        );
      }

      case "link": {
        if (
          !Array.isArray(blockNode.children) ||
          blockNode.children.length === 0
        ) {
          return <br key={index} />;
        }

        const url = blockNode.fields?.url;

        if (!url) {
          const linkChildren = await Promise.all(
            blockNode.children.map((child, i) => renderBlockNode(child, i)),
          );

          return <span key={index}>{linkChildren}</span>;
        }

        const linkChildren = await Promise.all(
          blockNode.children.map((child, i) => renderBlockNode(child, i)),
        );

        return (
          <Link
            className={twMerge(
              "text-primary font-bold",
              "transition-opacity duration-200 hover:opacity-70",
            )}
            key={index}
            href={url}
            rel={blockNode.fields?.newTab ? "noopener noreferrer" : undefined}
            target={blockNode.fields?.newTab ? "_blank" : "_self"}
            prefetch={false}
          >
            {linkChildren}
          </Link>
        );
      }

      case "linebreak":
        return <br key={index} />;

      case "horizontalrule":
        return <hr className="my-2 border-black/20" key={index} />;

      case "text": {
        const format = blockNode.format || 0;
        const classes: string[] = [];
        const style: React.CSSProperties = {};

        if ((format & 1) !== 0) {
          classes.push("font-bold");
        }

        if ((format & 2) !== 0) {
          classes.push("italic");
        }

        const hasStrikethrough = (format & 4) !== 0;
        const hasUnderline = (format & 8) !== 0;

        if (hasStrikethrough && hasUnderline) {
          style.textDecorationLine = "underline line-through";
        } else if (hasStrikethrough) {
          classes.push("line-through");
        } else if (hasUnderline) {
          classes.push("underline");
        }

        if ((format & 16) !== 0) {
          classes.push(
            "font-mono text-[14px] px-1.5 py-0.5 bg-primary-lightpurple/5",
            "text-dark rounded-md border border-primary/20",
          );
        }
        if ((format & 32) !== 0) {
          classes.push("align-sub text-[70%] pl-0.5 pt-0.5");
        }

        if ((format & 64) !== 0) {
          classes.push("align-super text-[70%] pl-0.5");
        }

        const nodeClassName =
          "className" in blockNode && typeof blockNode.className === "string"
            ? blockNode.className
            : undefined;

        return (
          <span
            className={twMerge(
              classes.length > 0 ? classes.join(" ") : undefined,
              nodeClassName,
            )}
            style={Object.keys(style).length > 0 ? style : undefined}
            key={index}
          >
            {blockNode.text}
          </span>
        );
      }

      default:
        return null;
    }
  };

  const children = await Promise.all(
    richText.root.children.map((child, index) => renderBlockNode(child, index)),
  );

  return (
    <div className={twMerge("flex flex-col gap-2", className)}>{children}</div>
  );
};

export default RichTextRenderer;
