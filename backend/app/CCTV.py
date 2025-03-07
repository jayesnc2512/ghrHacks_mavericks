import tkinter as tk
from tkinter import filedialog, messagebox
from helpers.ui import PythonUI
from helpers.modelCCTV import VideoObjectDetection

def CCTV():
    try:
        # Initialize Tkinter root and hide it initially
        root = tk.Tk()
        root.withdraw()  # Hide the main Tkinter window
        
        # Create and run the UI
        ui = PythonUI(root)
        root.deiconify()  # Show the Tkinter window
        root.mainloop()   # Start the Tkinter event loop
        
        # Get the selected values from the UI
        video_path = ui.video_path.get()
        site = ui.site_var.get()
        prediction_classes = [cls for cls, var in ui.prediction_vars.items() if var.get()]

        if not video_path:
            messagebox.showerror("Error", "Video path is required.")
            return

        if not prediction_classes:
            messagebox.showerror("Error", "At least one prediction class must be selected.")
            return

        # Print the selected values (for debugging)
        print(f"Video Path: {video_path}")
        print(f"Site: {site}")
        print(f"Prediction Classes: {','.join(prediction_classes)}")

        # Call the VideoObjectDetection method with the selected parameters
        VideoObjectDetection.detect_from_video(video_path=video_path, site=site, prediction_classes=','.join(prediction_classes))

    except Exception as err:
        print("Error in CCTV.py:", err)

if __name__ == "__main__":
    CCTV()
