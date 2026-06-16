$source = @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public class ImageProcessor {
    public static void RemoveBackground(string inputPath, string outputPath, int threshold) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int w = src.Width;
            int h = src.Height;
            using (Bitmap dest = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                using (Graphics g = Graphics.FromImage(dest)) {
                    g.DrawImage(src, 0, 0, w, h);
                }

                bool[,] visited = new bool[w, h];
                Queue<Point> queue = new Queue<Point>();

                // Enqueue all boundary pixels
                for (int x = 0; x < w; x++) {
                    queue.Enqueue(new Point(x, 0));
                    queue.Enqueue(new Point(x, h - 1));
                    visited[x, 0] = true;
                    visited[x, h - 1] = true;
                }
                for (int y = 0; y < h; y++) {
                    queue.Enqueue(new Point(0, y));
                    queue.Enqueue(new Point(w - 1, y));
                    visited[0, y] = true;
                    visited[w - 1, y] = true;
                }

                // Reference background color (corner pixel)
                Color refColor = src.GetPixel(0, 0);

                int[] dx = { 0, 0, 1, -1 };
                int[] dy = { 1, -1, 0, 0 };

                while (queue.Count > 0) {
                    Point p = queue.Dequeue();
                    Color c = src.GetPixel(p.X, p.Y);

                    // Calculate color distance squared
                    int rDiff = c.R - refColor.R;
                    int gDiff = c.G - refColor.G;
                    int bDiff = c.B - refColor.B;
                    int distSq = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;

                    // If it is close to the background color, make it transparent
                    if (distSq < threshold * threshold) {
                        dest.SetPixel(p.X, p.Y, Color.Transparent);

                        // Queue neighbors
                        for (int i = 0; i < 4; i++) {
                            int nx = p.X + dx[i];
                            int ny = p.Y + dy[i];

                            if (nx >= 0 && nx < w && ny >= 0 && ny < h && !visited[nx, ny]) {
                                visited[nx, ny] = true;
                                queue.Enqueue(new Point(nx, ny));
                            }
                        }
                    }
                }

                dest.Save(outputPath, ImageFormat.Png);
            }
        }
    }
}
"@

# Load assembly
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing

# Paths
$inputPath = "C:\Users\Mohit_ji\.gemini\antigravity\brain\beca79cf-27f8-4af4-82af-d604866de3bb\media__1781613082014.png"
$outputPath = "C:\Users\Mohit_ji\.gemini\antigravity\scratch\infinix-gt20-pro-website\assets\phone.png"

# Execute background removal with tolerance = 65
[ImageProcessor]::RemoveBackground($inputPath, $outputPath, 65)

Write-Host "Background removed successfully!"
