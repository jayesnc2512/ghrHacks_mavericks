import tkinter as tk
from tkinter import filedialog, messagebox

class PythonUI:
    def __init__(self, root):
        self.root = root
        self.root.title("CCTV Video Detection")

        # Video path label and entry
        tk.Label(root, text="Video Path:").pack(padx=10, pady=5)
        self.video_path = tk.Entry(root, width=50)
        self.video_path.pack(padx=10, pady=5)

        # Browse button
        tk.Button(root, text="Browse", command=self.browse_file).pack(padx=10, pady=5)

        # Site selection
        tk.Label(root, text="Site:").pack(padx=10, pady=5)
        self.site_var = tk.StringVar(value="dept_1")
        sites = ["dept_1", "dept_2", "dept_3"]
        for site in sites:
            tk.Radiobutton(root, text=site, variable=self.site_var, value=site).pack(anchor=tk.W, padx=10, pady=2)

        # Prediction classes selection
        tk.Label(root, text="Prediction Classes:").pack(padx=10, pady=5)
        self.prediction_vars = {
            "Person": tk.BooleanVar(value=True),
            "Gloves": tk.BooleanVar(value=True),
            "Helmet": tk.BooleanVar(value=True),
            "Goggles": tk.BooleanVar(value=True),
            "Vest": tk.BooleanVar(value=True),
            "Shoes": tk.BooleanVar(value=True)
        }
        for cls, var in self.prediction_vars.items():
            tk.Checkbutton(root, text=cls, variable=var).pack(anchor=tk.W, padx=10, pady=2)

        # Start processing button
        tk.Button(root, text="Start Processing", command=self.process_video).pack(padx=10, pady=20)

    def browse_file(self):
        file_path = filedialog.askopenfilename(filetypes=[("Video files", "*.mp4;*.avi;*.mov")])
        if file_path:
            self.video_path.delete(0, tk.END)
            self.video_path.insert(0, file_path)

    def process_video(self):
        video_path = self.video_path.get()
        site = self.site_var.get()
        prediction_classes = [cls for cls, var in self.prediction_vars.items() if var.get()]

        if not video_path:
            messagebox.showerror("Error", "Please select a video file.")
            return

        if not prediction_classes:
            messagebox.showerror("Error", "Please select at least one prediction class.")
            return

        # Call your video processing function here
        # Example: VideoObjectDetection.detect_from_video(video_path, site, ",".join(prediction_classes))

        # For demonstration
        print("Video Path:", video_path)
        print("Site:", site)
        print("Prediction Classes:", ",".join(prediction_classes))
        self.root.quit()  # Quit the app or update this as needed
