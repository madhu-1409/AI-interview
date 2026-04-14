import os
from fpdf import FPDF

# Configuration
PROJECT_DIR = "."  # Current directory
OUTPUT_FILE = "AI_Interview_Full_Source.pdf"
# Extensions to include
INCLUDE_EXTS = {'.js', '.jsx', '.ts', '.tsx', '.json', '.yaml', '.yml', '.md', '.css', '.html'}
# Directories to ignore
IGNORE_DIRS = {'node_modules', '.git', 'dist', 'build', 'coverage', '.idea', '.vscode'}
# Files to ignore
IGNORE_FILES = {'package-lock.json', 'yarn.lock', 'generate_pdf.py'}

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 10)
        self.cell(0, 10, 'AI Interview Assistant - Source Code Report', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 10, title, 1, 1, 'L', 1)
        self.ln(4)

    def chapter_body(self, body):
        self.set_font('Courier', '', 8) # Monospace font for code
        self.multi_cell(0, 4, body)
        self.ln()

def generate_source_pdf():
    pdf = PDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    print(f"Scanning directory: {os.path.abspath(PROJECT_DIR)}")
    
    file_count = 0
    
    for root, dirs, files in os.walk(PROJECT_DIR):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            file_path = os.path.join(root, file)
            _, ext = os.path.splitext(file)
            
            if ext in INCLUDE_EXTS and file not in IGNORE_FILES:
                # Calculate relative path for the title
                rel_path = os.path.relpath(file_path, PROJECT_DIR)
                print(f"Adding: {rel_path}")
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Add to PDF
                    pdf.chapter_title(rel_path)
                    # Handle basic latin characters, replace incompatible ones
                    content = content.encode('latin-1', 'replace').decode('latin-1')
                    pdf.chapter_body(content)
                    file_count += 1
                except Exception as e:
                    print(f"Skipping {rel_path}: {str(e)}")

    pdf.output(OUTPUT_FILE)
    print(f"\nSuccess! Generated {OUTPUT_FILE} with {file_count} files.")

if __name__ == "__main__":
    generate_source_pdf()