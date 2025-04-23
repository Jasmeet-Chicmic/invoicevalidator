import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import './FilePreviewer.scss';
import IMAGES from '../../../Shared/Images';

type FilePreviewerProps = {
  isImage: boolean;
  fileUrl: string;
};

const FilePreviewer: React.FC<FilePreviewerProps> = ({ fileUrl, isImage }) => {
  return (
    <div className="invoice-preview">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={5}
        wheel={{ step: 0.2 }}
        doubleClick={{ disabled: false }}
        panning={{ disabled: false }}
        pinch={{ disabled: false }}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => {
          return (
            <>
              {/* Optional Controls */}
              <div className="zoom-controls">
                <button className="button-zoomin" onClick={() => zoomIn()}>
                  <img src={IMAGES.zoominIcon} alt="+" />
                </button>
                <button className="button-zoomout" onClick={() => zoomOut()}>
                  <img src={IMAGES.zoomoutIcon} alt="-" />
                </button>
                <button
                  className="button-reset"
                  onClick={() => resetTransform()}
                >
                  <img src={IMAGES.resetIcon} alt="reset" />
                </button>
              </div>

              <TransformComponent wrapperClass="zoom-wrapper">
                {isImage ? (
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="file-previewer-image"
                  />
                ) : (
                  <iframe
                    src={fileUrl}
                    className="file-previewer-pdf"
                    title="PDF Preview"
                  />
                )}
              </TransformComponent>
            </>
          );
        }}
      </TransformWrapper>
    </div>
  );
};

export default FilePreviewer;
