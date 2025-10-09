import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

const SUBJECT_TAGS = [
  "mathematics", "physics", "chemistry", "biology", "computer-science",
  "english", "accounting", "geography", "business-studies", "history",
  "integrated-science", "combined-science", "further-mathematics",
  "additional-mathematics", "commerce", "economics", "divinity",
  "bible-study", "building", "technical-graphics", "agriculture",
  "fashion-and-fabrics", "food-and-nutrition", "shona", "ndebele",
  "literature-in-english", "heritage-studies", "crop-science",
  "statistics", "business-enterprise-skills", "family-and-religious-studies", "other"
];

const RESOURCE_TYPE_TAGS = [
  "question-paper", "marking-scheme", "green-book", "blue-book", "textbook", "notes"
];

export default function UploadForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    curriculum: "",
    level: "",
    form: "",
    coverUrl: "",
    bookType: "",
    year: "",
    examSession: "",
    description: "",
  });

  // Check if user is authenticated
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Check file sizes
      const oversizedFiles = selectedFiles.filter(f => f.size > 500 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: `${oversizedFiles.length} file(s) exceed 500MB limit`,
          variant: "destructive",
        });
        e.target.value = '';
        return;
      }
      
      setFiles(selectedFiles);
      
      // Auto-fill title from first filename if only one file
      if (selectedFiles.length === 1) {
        const fileNameWithoutExtension = selectedFiles[0].name.replace(/\.(pdf|epub|docx?|pptx?)$/i, '');
        setBookData(prev => ({ ...prev, title: fileNameWithoutExtension }));
      } else {
        setBookData(prev => ({ ...prev, title: "" }));
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFileWithProgress = (formData: FormData): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        const response = new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: new Headers({
            'Content-Type': xhr.getResponseHeader('Content-Type') || 'application/json'
          })
        });
        resolve(response);
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', '/api/books/upload');
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 1 && !bookData.title) {
      toast({
        title: "Missing title",
        description: "Please enter a book title",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let successCount = 0;
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        // Use provided title for single file, or filename for multiple files
        const title = files.length === 1 ? bookData.title : file.name.replace(/\.(pdf|epub|docx?|pptx?)$/i, '');
        formData.append('title', title);
        
        // Only append optional fields if they have values
        if (bookData.author) formData.append('author', bookData.author);
        if (bookData.curriculum) formData.append('curriculum', bookData.curriculum);
        if (bookData.level) formData.append('level', bookData.level);
        if (bookData.form) formData.append('form', bookData.form);
        if (bookData.coverUrl) formData.append('coverUrl', bookData.coverUrl);
        if (bookData.bookType) formData.append('bookType', bookData.bookType);
        if (bookData.description) formData.append('description', bookData.description);
        if (bookData.year) formData.append('year', bookData.year);
        if (bookData.examSession) formData.append('examSession', bookData.examSession);
        
        formData.append('tags', JSON.stringify(selectedTags));

        // Reset progress for each file
        setUploadProgress(0);
        const response = await uploadFileWithProgress(formData);

        if (response.ok) {
          successCount++;
        } else {
          const error = await response.json();
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      setIsUploading(false);
      
      if (successCount === totalFiles) {
        toast({
          title: "Upload successful! ✓",
          description: `${successCount} book${successCount > 1 ? 's' : ''} uploaded successfully`,
        });
        setTimeout(() => setLocation('/'), 1500);
      } else if (successCount > 0) {
        toast({
          title: "Partial success",
          description: `${successCount} of ${totalFiles} books uploaded`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload books",
          variant: "destructive",
        });
      }

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload book",
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Educational Resource</CardTitle>
        <CardDescription>
          {user ? (
            <>Uploading as <span className="font-semibold text-sky-600">{user.username}</span></>
          ) : (
            <>Uploading anonymously - Login to get credit for your uploads</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Book Files (PDF, EPUB, DOCX, DOC, PPT, PPTX) - Select multiple files</Label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                accept=".pdf,.epub,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
                disabled={isUploading}
                className="cursor-pointer"
                data-testid="input-file"
                multiple
              />
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected:</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 text-sm bg-sky-50 dark:bg-sky-900/20 p-2 rounded">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-sky-600 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Book Title {files.length > 1 && <span className="text-muted-foreground text-sm">(Auto-filled from filenames)</span>}
              </Label>
              <Input
                id="title"
                placeholder="e.g., Mathematics Revision Guide"
                value={bookData.title}
                onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                disabled={isUploading || files.length > 1}
                data-testid="input-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author <span className="text-muted-foreground text-sm">(Optional)</span></Label>
              <Input
                id="author"
                placeholder="e.g., John Doe"
                value={bookData.author}
                onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                disabled={isUploading}
                data-testid="input-author"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="curriculum">Curriculum <span className="text-muted-foreground text-sm">(Optional)</span></Label>
              <Select value={bookData.curriculum} onValueChange={(value) => setBookData({ ...bookData, curriculum: value })} disabled={isUploading}>
                <SelectTrigger id="curriculum" data-testid="select-curriculum">
                  <SelectValue placeholder="Select curriculum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ZIMSEC">ZIMSEC</SelectItem>
                  <SelectItem value="Cambridge">Cambridge</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level <span className="text-muted-foreground text-sm">(Optional)</span></Label>
              <Select value={bookData.level} onValueChange={(value) => setBookData({ ...bookData, level: value })} disabled={isUploading}>
                <SelectTrigger id="level" data-testid="select-level">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O-Level">O-Level</SelectItem>
                  <SelectItem value="A-Level">A-Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="form">Form/Grade <span className="text-muted-foreground text-sm">(Optional)</span></Label>
              <Select value={bookData.form} onValueChange={(value) => setBookData({ ...bookData, form: value })} disabled={isUploading}>
                <SelectTrigger id="form" data-testid="select-form">
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                  <SelectItem value="Lower 6">Lower 6</SelectItem>
                  <SelectItem value="Upper 6">Upper 6</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookType">Book Type <span className="text-muted-foreground text-sm">(Optional)</span></Label>
              <Select value={bookData.bookType} onValueChange={(value) => setBookData({ ...bookData, bookType: value })} disabled={isUploading}>
                <SelectTrigger id="bookType" data-testid="select-book-type">
                  <SelectValue placeholder="Select book type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Textbook">Textbook</SelectItem>
                  <SelectItem value="Past Exam Paper">Past Exam Paper</SelectItem>
                  <SelectItem value="Marking Scheme">Marking Scheme</SelectItem>
                  <SelectItem value="Greenbook">Greenbook</SelectItem>
                  <SelectItem value="Bluebook">Bluebook</SelectItem>
                  <SelectItem value="Syllabus">Syllabus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(bookData.bookType === "Past Exam Paper" || bookData.bookType === "Marking Scheme") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Exam Year</Label>
                <Input
                  id="year"
                  placeholder="e.g., 2023"
                  value={bookData.year}
                  onChange={(e) => setBookData({ ...bookData, year: e.target.value })}
                  disabled={isUploading}
                  data-testid="input-year"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="examSession">Exam Session</Label>
                <Select value={bookData.examSession} onValueChange={(value) => setBookData({ ...bookData, examSession: value })} disabled={isUploading}>
                  <SelectTrigger id="examSession" data-testid="select-exam-session">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="June">June</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-muted-foreground text-sm">(Optional)</span></Label>
            <Textarea
              id="description"
              placeholder="e.g., O level Mathematics June 2025 Paper 1, or New General Mathematics Book 4, or O level Mathematics syllabus 2017-2022"
              value={bookData.description}
              onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
              disabled={isUploading}
              rows={3}
              data-testid="input-description"
            />
          </div>

          <div className="space-y-3">
            <Label>Tags <span className="text-muted-foreground text-sm">(Optional)</span></Label>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Subject</p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_TAGS.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover-elevate"
                      onClick={() => !isUploading && toggleTag(tag)}
                    >
                      {tag.replace(/-/g, ' ')}
                      {selectedTags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Resource Type</p>
                <div className="flex flex-wrap gap-2">
                  {RESOURCE_TYPE_TAGS.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover-elevate"
                      onClick={() => !isUploading && toggleTag(tag)}
                    >
                      {tag.replace(/-/g, ' ')}
                      {selectedTags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {selectedTags.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Selected: {selectedTags.join(', ')}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverUrl">Cover Image URL (Optional)</Label>
            <Input
              id="coverUrl"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={bookData.coverUrl}
              onChange={(e) => setBookData({ ...bookData, coverUrl: e.target.value })}
              disabled={isUploading}
              data-testid="input-cover-url"
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={isUploading} data-testid="button-submit-upload">
            <Upload className="w-4 h-4" />
            {isUploading ? `Uploading... ${Math.round(uploadProgress)}%` : `Upload ${files.length > 1 ? `${files.length} Books` : 'Book'}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}