
"use client";

import { FileDown, Trash2, Eraser, ScanLine, Edit } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { blocos } from "@/lib/blocks";
import { generateChecklistPDF } from "@/lib/pdf";
import SignatureDialog from "@/components/SignatureDialog";

const ScannerDialog = dynamic(() => import('@/components/ScannerDialog'), { ssr: false });

type FormValues = {
  cliente: string;
  modelo: string;
  versao: string;
  numeroOS: string;
  numeroSerie: string;
  dataVisita: string;
  nomeTecnico: string;
  bloco: string;
  checks: Record<string, boolean>;
  observacoes: string;
  signatureDataUrl: string | null;
};

const initialValues: FormValues = {
  cliente: "",
  modelo: "",
  versao: "",
  numeroOS: "",
  numeroSerie: "",
  dataVisita: new Date().toISOString().split("T")[0],
  nomeTecnico: "",
  bloco: Object.keys(blocos)[0],
  checks: {},
  observacoes: "",
  signatureDataUrl: null,
};

export default function Home() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [isSignatureDialogOpen, setSignatureDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("checklistFormData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("checklistFormData", JSON.stringify(formData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [formData]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bloco: value, checks: {} }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      checks: {
        ...prev.checks,
        [name]: checked,
      },
    }));
  };
  
  const handleClearSignature = () => {
    setFormData(prev => ({ ...prev, signatureDataUrl: null }));
  };
  
  const handleSaveSignature = (dataUrl: string) => {
    setFormData(prev => ({...prev, signatureDataUrl: dataUrl }));
    setSignatureDialogOpen(false);
  }

  const handleGeneratePdf = async () => {
    const requiredFields: (keyof Omit<FormValues, 'numeroOS' | 'signatureDataUrl' | 'bloco' | 'checks' | 'observacoes' | 'versao' | 'numeroSerie'>)[] = ["cliente", "modelo", "dataVisita", "nomeTecnico"];
    const missingField = requiredFields.find(field => !formData[field]);

    if (missingField) {
      toast({
        variant: "destructive",
        title: "Campo Obrigatório",
        description: `Por favor, preencha o campo: ${missingField}`,
      });
      return;
    }

    if (!formData.signatureDataUrl) {
      toast({
        variant: "destructive",
        title: "Assinatura Obrigatória",
        description: "Por favor, capture a assinatura do cliente.",
      });
      return;
    }
    
    try {
      await generateChecklistPDF({
        header: formData,
        checks: formData.checks,
        observacoes: formData.observacoes,
        signature: formData.signatureDataUrl,
      });

      toast({
        title: "PDF Gerado!",
        description: "O checklist foi salvo como um arquivo PDF.",
        className: "bg-accent text-accent-foreground",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro inesperado ao gerar o PDF.";
      toast({
        variant: "destructive",
        title: "Não foi possível gerar o PDF",
        description: errorMessage,
      });
    }
  };

  const handleClearAll = () => {
    setFormData(initialValues);
    toast({ title: "Formulário limpo", description: "Todos os dados foram apagados." });
  };

  const handleScanSuccess = (decodedText: string) => {
    setFormData(prev => ({...prev, numeroSerie: decodedText}));
    setScannerOpen(false);
    toast({
        title: "Código escaneado!",
        description: `Número de série: ${decodedText}`,
    });
  };
  
  const renderCheckboxes = () => {
    const selectedBlocoKey = formData.bloco;
    if (!selectedBlocoKey || !blocos[selectedBlocoKey]) {
      return null;
    }

    const subBlocos = blocos[selectedBlocoKey];
    return (
      <div className="space-y-6">
        {Object.entries(subBlocos).map(([subBlocoNome, checks]) => (
          <div key={subBlocoNome}>
            <h4 className="font-medium text-lg mb-2">{subBlocoNome}</h4>
            <div className="space-y-2">
              {checks.map((check) => (
                <div key={check.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`check-${check.name}`}
                    checked={formData.checks[check.name] ?? false}
                    onCheckedChange={(checked) => handleCheckboxChange(check.name, !!checked)}
                  />
                  <Label htmlFor={`check-${check.name}`}>{check.label}</Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
       {isScannerOpen && (
        <ScannerDialog
          onScanSuccess={handleScanSuccess}
          onClose={() => setScannerOpen(false)}
        />
      )}
      {isSignatureDialogOpen && (
          <SignatureDialog
              onSave={handleSaveSignature}
              onClose={() => setSignatureDialogOpen(false)}
              initialDataUrl={formData.signatureDataUrl}
          />
      )}
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl sm:text-3xl font-headline">Checklist Generator Pro</CardTitle>
              <CardDescription>Preencha os dados para gerar o checklist.</CardDescription>
            </div>
            <Button type="button" variant="ghost" onClick={handleClearAll} size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Limpar Tudo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-headline border-b pb-2">Informações Gerais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Input id="cliente" value={formData.cliente} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" value={formData.modelo} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="versao">Versão</Label>
                <Input id="versao" value={formData.versao} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="numeroOS">Número OS</Label>
                <Input id="numeroOS" value={formData.numeroOS} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="numeroSerie">Número de Série</Label>
                <div className="flex items-center gap-2">
                  <Input id="numeroSerie" value={formData.numeroSerie} onChange={handleInputChange} />
                  <Button variant="outline" size="icon" onClick={() => setScannerOpen(true)}>
                    <ScanLine className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="dataVisita">Data da Visita</Label>
                <Input id="dataVisita" type="date" value={formData.dataVisita} onChange={handleInputChange} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="nomeTecnico">Nome do Técnico</Label>
                <Input id="nomeTecnico" value={formData.nomeTecnico} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-headline border-b pb-2">Itens de Verificação</h3>
            <div>
              <Label htmlFor="bloco">Bloco</Label>
              <Select onValueChange={handleSelectChange} value={formData.bloco}>
                <SelectTrigger id="bloco">
                  <SelectValue placeholder="Selecione um bloco" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(blocos).map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 border rounded-md bg-secondary/30">
              {renderCheckboxes()}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-xl font-semibold font-headline border-b pb-2">Observações</h3>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" value={formData.observacoes} onChange={handleInputChange} rows={4} placeholder="Digite as observações aqui..." />
            </div>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold font-headline border-b pb-2">Assinatura do Cliente</h3>
                {formData.signatureDataUrl && (
                  <Button variant="ghost" size="sm" onClick={handleClearSignature}>
                      <Eraser className="mr-2 h-4 w-4" />
                      Limpar Assinatura
                  </Button>
                )}
            </div>
             <div 
                className="w-full h-[200px] border border-dashed rounded-md flex items-center justify-center bg-secondary/30 cursor-pointer"
                onClick={() => setSignatureDialogOpen(true)}
              >
                {formData.signatureDataUrl ? (
                    <div className="relative w-full h-full">
                        <Image src={formData.signatureDataUrl} alt="Assinatura Salva" layout="fill" objectFit="contain" />
                         <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex items-center justify-center transition-opacity opacity-0 hover:opacity-100">
                           <p className="text-white font-bold flex items-center gap-2"><Edit className="h-5 w-5"/> Editar Assinatura</p>
                        </div>
                    </div>
                ) : (
                    <Button type="button" variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Coletar Assinatura
                    </Button>
                )}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-4 p-4 sm:p-6">
          <Button type="button" onClick={handleGeneratePdf} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            <FileDown /> Gerar PDF
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
