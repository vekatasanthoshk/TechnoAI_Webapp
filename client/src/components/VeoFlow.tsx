import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Play, Loader2, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VeoFlow() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setVideoUrl(null);

    // Simulate Veo generation delay
    setTimeout(() => {
      setIsGenerating(false);
      // Placeholder realistic high-quality video
      setVideoUrl("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
    }, 3500);
  };

  return (
    <section className="py-24 bg-[#0d1b3e] relative overflow-hidden text-white" id="veo-flow">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2962FF]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00C8B3]/20 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#00C8B3]" />
            <span className="text-sm font-medium tracking-wide">Powered by Google Veo</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-4"
          >
            Generative Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962FF] to-[#00C8B3]">Flow</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            Experience the future of UI/UX. Describe your vision, and our integrated Veo Flow will bring it to life instantly with technical motion graphics.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Output Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="aspect-video w-full rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl mb-8 relative overflow-hidden flex items-center justify-center shadow-2xl"
          >
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="w-12 h-12 text-[#00C8B3] animate-spin" />
                  <div className="text-white/80 font-medium font-mono text-sm tracking-widest uppercase">
                    Synthesizing Video...
                  </div>
                  <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#2962FF] to-[#00C8B3]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3.5, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              ) : videoUrl ? (
                <motion.video 
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full object-cover"
                  src={videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center text-white/30"
                >
                  <Video className="w-16 h-16 mb-4 opacity-50" />
                  <p className="font-medium text-lg">Awaiting Prompt</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Corner technical accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-xl m-4" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-xl m-4" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-xl m-4" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-xl m-4" />
          </motion.div>

          {/* Input Area */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onSubmit={handleGenerate} 
            className="flex flex-col sm:flex-row gap-4 relative"
          >
            <div className="relative flex-1 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2962FF] to-[#00C8B3] rounded-xl blur opacity-20 group-focus-within:opacity-50 transition duration-500" />
              <Input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
                placeholder="A cinematic 3D render of an AI neural core, glowing blue lines, hyper-realistic..."
                className="relative w-full h-14 bg-black/60 border-white/20 text-white placeholder:text-white/40 focus:border-[#00C8B3] rounded-xl px-6 text-lg shadow-inner"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isGenerating || !prompt.trim()}
              className="h-14 px-8 bg-gradient-to-r from-[#2962FF] to-[#00C8B3] hover:from-[#1b4bd6] hover:to-[#00a896] text-white rounded-xl font-bold text-lg border-0 shadow-[0_0_20px_rgba(41,98,255,0.3)] transition-all disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : (
                <>
                  Generate <Play className="w-5 h-5 ml-2 fill-current" />
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
