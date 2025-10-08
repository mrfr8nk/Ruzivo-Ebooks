
import { Download, TrendingUp, BookOpen, Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { downloadBook } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  curriculum?: string;
  level: "O-Level" | "A-Level";
  form: string;
  coverUrl?: string;
  downloads: number;
  uploadedBy?: string;
  isTrending?: boolean;
  fileSize?: number;
  tags?: string[];
}

export default function BookCard({ id, title, author, level, form, coverUrl, downloads, uploadedBy, curriculum, isTrending, fileSize, tags = [] }: BookCardProps) {
  
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = async () => {
    try {
      await downloadBook(id, `${title}.pdf`);
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/trending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/books/most-downloaded'] });

      toast({
        title: "Download started",
        description: `Downloading ${title}`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download book",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="group overflow-hidden backdrop-blur-xl bg-white dark:bg-gray-900 border-2 border-sky-200/30 dark:border-sky-700/30 shadow-lg hover:shadow-2xl hover:shadow-sky-500/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-sky-400/50 rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[2/3] relative bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900 dark:to-blue-900 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6">
            <img 
              src="https://cdn.mrfrankofc.gleeze.com/pdf_image.png" 
              alt={title}
              className={`w-full h-full object-contain transition-all duration-500 ${isHovered ? 'scale-110' : ''}`}
            />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-sky-900/90 via-sky-900/50 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="flex-1 bg-white/90 hover:bg-white text-sky-600 border-sky-200"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="flex-1 bg-white text-sky-600 hover:bg-sky-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 rounded-lg"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isTrending && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        )}
        {curriculum && (
          <div className="absolute top-3 left-3 backdrop-blur-md bg-white/90 dark:bg-black/60 text-xs font-semibold px-3 py-1.5 rounded-lg border border-sky-200/50 dark:border-sky-700/50 shadow-md">
            {curriculum}
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="font-bold text-lg mb-1 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium">
          <span className="font-semibold text-sky-600 dark:text-sky-400">Author:</span> {author}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-gradient-to-r from-sky-500 to-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow rounded-lg px-3 py-1">
            {level}
          </Badge>
          <Badge variant="outline" className="border-2 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 backdrop-blur rounded-lg px-3 py-1 font-semibold">
            {form}
          </Badge>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-0"
              >
                {tag.replace(/-/g, ' ')}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 border-0">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {uploadedBy && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 pt-2 border-t border-sky-100 dark:border-sky-900">
            <span className="font-semibold text-sky-600 dark:text-sky-400">Uploaded by:</span> {uploadedBy}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-sky-50 dark:bg-sky-900/30 px-3 py-1.5 rounded-lg">
              <Download className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span className="font-bold text-sky-700 dark:text-sky-300">{downloads}</span>
            </div>
            {fileSize && (
              <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 px-3 py-1.5 rounded-lg">
                {formatFileSize(fileSize)}
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg md:hidden"
            data-testid={`button-download-${id}`}
          >
            <Download className="w-4 h-4" />
            Get
          </Button>
        </div>
      </CardContent>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-4">
              {coverUrl ? (
                <img src={coverUrl} alt={title} className="w-32 h-48 object-cover rounded-lg" />
              ) : (
                <div className="w-32 h-48 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-sky-600" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <p className="text-sm text-muted-foreground">Author: <span className="font-semibold">{author}</span></p>
                {curriculum && <p className="text-sm text-muted-foreground">Curriculum: <span className="font-semibold">{curriculum}</span></p>}
                <p className="text-sm text-muted-foreground">Level: <span className="font-semibold">{level}</span></p>
                <p className="text-sm text-muted-foreground">Form: <span className="font-semibold">{form}</span></p>
                {uploadedBy && <p className="text-sm text-muted-foreground">Uploaded by: <span className="font-semibold">{uploadedBy}</span></p>}
                {fileSize && (
                  <p className="text-sm text-muted-foreground">Size: <span className="font-semibold">{formatFileSize(fileSize)}</span></p>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="gap-1">
                    <Download className="w-3 h-3" />
                    {downloads} downloads
                  </Badge>
                  {isTrending && (
                    <Badge className="bg-orange-500 gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button onClick={handleDownload} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
