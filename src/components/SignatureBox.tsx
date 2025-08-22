
"use client";

import React from "react";
import SignatureCanvas from "react-signature-canvas";

const SignatureBox = React.forwardRef<SignatureCanvas>((props, ref) => {
  return (
    <div className="rounded-md border border-input bg-background w-full h-[200px]">
      <SignatureCanvas
        ref={ref}
        penColor="black"
        canvasProps={{
          className: "w-full h-full"
        }}
      />
    </div>
  );
});

SignatureBox.displayName = "SignatureBox";

export default SignatureBox;
