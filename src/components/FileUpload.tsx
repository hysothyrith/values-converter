import * as React from "react";

const FileUploadContext = React.createContext({});

function FileUpload() {}

function FileUploadTrigger() {}

const Root = FileUpload;
const Trigger = FileUploadTrigger;

export {
  FileUpload,
  FileUploadTrigger,
  //
  Root,
  Trigger,
};
