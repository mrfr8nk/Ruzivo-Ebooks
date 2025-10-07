import UploadForm from "@/components/UploadForm";

export default function Upload() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="heading-upload">
          Share Your Knowledge
        </h1>
        <p className="text-lg text-muted-foreground" data-testid="text-upload-description">
          Upload educational resources and help fellow ZIMSEC students succeed
        </p>
      </div>
      
      <UploadForm />
    </div>
  );
}
