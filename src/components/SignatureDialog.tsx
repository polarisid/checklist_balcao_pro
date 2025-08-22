
"use client";

import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eraser, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignatureDialogProps {
  onSave: (dataUrl: string) => void;
  onClose: () => void;
  initialDataUrl: string | null;
}

const SignatureDialog: React.FC<SignatureDialogProps> = ({ onSave, onClose, initialDataUrl }) => {
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Redimensiona o canvas para caber na tela quando o componente é montado.
    // Isso é importante para o funcionamento correto em dispositivos móveis.
    const resizeCanvas = () => {
      if (sigCanvasRef.current) {
        const canvas = sigCanvasRef.current.getCanvas();
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d")?.scale(ratio, ratio);
        
        // Se houver uma assinatura inicial, redesenha ela após o redimensionamento.
        if (initialDataUrl) {
           sigCanvasRef.current.fromDataURL(initialDataUrl);
        }
      }
    };
    
    // Um pequeno timeout para garantir que o dialog esteja visível antes de redimensionar
    setTimeout(resizeCanvas, 50); 
    
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [initialDataUrl]);
  
  const handleClear = () => {
    sigCanvasRef.current?.clear();
  };

  const handleSave = () => {
    if (sigCanvasRef.current?.isEmpty()) {
      toast({
        variant: "destructive",
        title: "Campo Vazio",
        description: "Por favor, desenhe uma assinatura antes de salvar.",
      });
      return;
    }
    const dataUrl = sigCanvasRef.current!.getTrimmedCanvas().toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-[95vw] h-[60vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assinatura do Cliente</DialogTitle>
        </DialogHeader>
        <div className="flex-grow rounded-md border border-input bg-background w-full h-full my-4">
            <SignatureCanvas
                ref={sigCanvasRef}
                penColor="black"
                canvasProps={{
                className: "w-full h-full"
                }}
            />
        </div>
        <DialogFooter className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
            <Button variant="outline" onClick={handleClear}>
                <Eraser className="mr-2 h-4 w-4" />
                Limpar
            </Button>
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Assinatura
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureDialog;
