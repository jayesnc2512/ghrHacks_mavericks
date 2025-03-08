import pygame
import time

def play_alert():
    """
    Plays an alert sound for 5 seconds when called.
    """
    pygame.mixer.init()
    pygame.mixer.music.load("app/helpers/model/alert.wav")  # Ensure "alert.wav" is in the correct directory
    pygame.mixer.music.play()

    # Wait for 5 seconds, then stop the sound
    pygame.time.wait(4000)  # 5000 milliseconds = 5 seconds
    pygame.mixer.music.stop()

if __name__ == "__main__":
    play_alert()  # For testing
