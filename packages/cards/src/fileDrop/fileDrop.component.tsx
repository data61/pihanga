import React from 'react';
import { PiCardSimpleProps } from '@pihanga/core';
import { FileUploader } from 'react-drag-drop-files';

export type ComponentProps = {
  fileTypes?: string[];
};

const DEF_FILE_TYPES = ["JPG", "PNG", "GIF"];

export type SomeEvent = {
  something: string;
};

type ComponentT = ComponentProps & {
  onSomething: (ev: SomeEvent) => void;
};

export const Component = (props: PiCardSimpleProps<ComponentT>) => {
  const {
    fileTypes = DEF_FILE_TYPES,
    cardName,
  } = props;

  function handleChange(file: any) {
    console.log(">>>> FILE", file);
  };

  function renderDropZone() {
    return null;

    // return (
    //   <label className="fooX sc-beqWaB ewqTBN" htmlFor="file">
    //     <input accept=".jpg,.png,.gif" type="file" name="file" />
    //     <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.33317 6.66667H22.6665V16H25.3332V6.66667C25.3332 5.196 24.1372 4 22.6665 4H5.33317C3.8625 4 2.6665 5.196 2.6665 6.66667V22.6667C2.6665 24.1373 3.8625 25.3333 5.33317 25.3333H15.9998V22.6667H5.33317V6.66667Z" fill="#0658C2"></path><path d="M10.6665 14.6667L6.6665 20H21.3332L15.9998 12L11.9998 17.3333L10.6665 14.6667Z" fill="#0658C2"></path><path d="M25.3332 18.6667H22.6665V22.6667H18.6665V25.3333H22.6665V29.3333H25.3332V25.3333H29.3332V22.6667H25.3332V18.6667Z" fill="#0658C2"></path></svg>
    //     <div className="sc-dmqHEX kyUZVo">
    //       <span className="sc-hLseeU llmFop"><span>UploadX</span> or drop a file right here</span>
    //       <span title="allowed types: JPG,PNG,GIF" className="file-types">JPG,PNG,GIF</span>
    //     </div>
    //   </label>
    // )
  }

  return (
    <div className={`pi-file-drop pi-file-drop-${cardName}`} data-pihanga={cardName}>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        children={renderDropZone()}
      />
    </div>
  );
}