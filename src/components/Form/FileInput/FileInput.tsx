import React, { type ComponentPropsWithRef, forwardRef } from "react";

const FileInput = forwardRef<HTMLInputElement, ComponentPropsWithRef<"input">>(
  (props, ref) => (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor="dropzone-file"
        className="dark:bg-dim-200 dark:hover:bg-dim-50 flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-neutral-600 dark:hover:border-indigo-500"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mb-2 h-8 w-8 text-gray-400"
          >
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          <p className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Click to upload
          </p>
        </div>
        <input
          ref={ref}
          {...props}
          id="dropzone-file"
          type="file"
          className="hidden"
        />
      </label>
    </div>
  )
);

FileInput.displayName = "FileInput";

export default FileInput;
