import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface AnimationControlsProps {
  isAnimating: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  duration: number;
  onDurationChange: (value: number) => void;
  disabled: boolean;
}

export const AnimationControls = ({
  isAnimating,
  onPlay,
  onPause,
  onReset,
  duration,
  onDurationChange,
  disabled,
}: AnimationControlsProps) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border">
      <div className="flex items-center gap-2">
        {!isAnimating ? (
          <Button
            onClick={onPlay}
            disabled={disabled}
            size="lg"
            className="bg-accent hover:bg-accent/90"
          >
            <Play className="w-5 h-5 mr-2" />
            Iniciar
          </Button>
        ) : (
          <Button
            onClick={onPause}
            size="lg"
            variant="secondary"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pausar
          </Button>
        )}

        <Button
          onClick={onReset}
          disabled={disabled}
          size="lg"
          variant="outline"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reiniciar
        </Button>
      </div>

      <div className="h-8 w-px bg-border" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="lg">
            <Settings className="w-5 h-5 mr-2" />
            Duração: {duration}s
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Duração da Animação</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[duration]}
                  onValueChange={(value) => onDurationChange(value[0])}
                  min={3}
                  max={30}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12 text-right">
                  {duration}s
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Controla a velocidade do percurso do carrinho
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
