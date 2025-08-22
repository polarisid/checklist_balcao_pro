
"use client";

import React, { useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureBoxProps {
    initialDataUrl?: string | null;
}

const SignatureBox = React.forwardRef<SignatureCanvas, SignatureBoxProps>((props, ref) => {
    const internalRef = ref as React.RefObject<SignatureCanvas>;

    useEffect(() => {
        if (props.initialDataUrl && internalRef.current) {
            // Um pequeno atraso para garantir que o canvas esteja pronto
            setTimeout(() => {
                if (internalRef.current) {
                   internalRef.current.fromDataURL(props.initialDataUrl!);
                }
            }, 50);
        }
    }, [props.initialDataUrl, internalRef]);

    return (
        <div className="rounded-md border border-input bg-background w-full h-[200px]" style={{ touchAction: 'none' }}>
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
