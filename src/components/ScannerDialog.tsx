
"use client";

import { useEffect, useRef, useState } from 'react';
import type { Html5Qrcode, Html5QrcodeError, Html5QrcodeResult, CameraDevice } from 'html5-qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';

interface ScannerDialogProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const qrboxFunction = (viewfinderWidth: number, viewfinderHeight: number) => {
  const minEdgePercentage = 0.7;
  const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
  const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
  return {
    width: qrboxSize,
    height: qrboxSize,
  };
};

const ScannerDialog: React.FC<ScannerDialogProps> = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();
  const scannerContainerId = "camera-application";
  
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let instance: Html5Qrcode;

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      instance = new Html5Qrcode(scannerContainerId, false);
      scannerRef.current = instance;

      Html5Qrcode.getCameras()
        .then(devices => {
          if (devices && devices.length) {
            setCameras(devices);
            // Prioritize the back camera
            const backCamera = devices.find(d => d.label.toLowerCase().includes('back')) || devices.find(d => d.label.toLowerCase().includes('traseira'));
            setSelectedCameraId(backCamera?.id || devices[0].id);
          }
        })
        .catch(err => {
          console.error("Error getting cameras:", err);
          toast({
            variant: "destructive",
            title: "Erro de Câmera",
            description: "Não foi possível obter a lista de câmeras. Verifique as permissões.",
          });
        });
    }).catch(err => {
      console.error("Failed to load html5-qrcode library", err);
      toast({
        variant: "destructive",
        title: "Erro no Scanner",
        description: "Não foi possível carregar a biblioteca do scanner.",
      });
    });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(err => {
          console.warn("Error stopping scanner on cleanup:", err);
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scanner = scannerRef.current;
    if (scanner && selectedCameraId) {
      const startScanner = () => {
        scanner.start(
          selectedCameraId,
          {
            fps: 10,
            qrbox: qrboxFunction,
            aspectRatio: 1.0,
          },
          (decodedText: string, result: Html5QrcodeResult) => {
            onScanSuccess(decodedText);
          },
          (errorMessage: string, error: Html5QrcodeError) => {
            // Ignore scan errors
          }
        ).then(() => {
          setIsScanning(true);
        }).catch((err: any) => {
          console.error(`Scanner start error for camera ${selectedCameraId}:`, err);
          toast({
              variant: "destructive",
              title: "Erro ao Iniciar Câmera",
              description: "Não foi possível iniciar a câmera selecionada. Tente outra.",
          });
        });
      };

      if (scanner.isScanning) {
        scanner.stop()
          .then(() => {
            setIsScanning(false);
            startScanner();
          })
          .catch(err => {
            console.error("Error stopping scanner to switch camera:", err);
          });
      } else {
        startScanner();
      }
    }
  }, [selectedCameraId, onScanSuccess, toast]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Escanear Código</DialogTitle>
          <DialogDescription>
            Aponte a câmera para o código de barras ou QR code.
          </DialogDescription>
        </DialogHeader>
        
        <div id={scannerContainerId} className="w-full aspect-video rounded-md overflow-hidden bg-black"></div>
        
        {cameras.length > 1 && (
          <div className="grid gap-2">
            <Label htmlFor="camera-select">Selecionar Câmera</Label>
            <Select value={selectedCameraId} onValueChange={setSelectedCameraId}>
              <SelectTrigger id="camera-select">
                <SelectValue placeholder="Selecione uma câmera" />
              </SelectTrigger>
              <SelectContent>
                {cameras.map(camera => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScannerDialog;
