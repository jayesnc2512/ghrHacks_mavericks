

import subprocess
import time

async def lip_sync_message(message):
    start_time = time.time() * 1000  # Convert to milliseconds
    print(f"Starting conversion for message {message}")

    await exec_command(
        f"ffmpeg -y -i audios/message_{message}.mp3 audios/message_{message}.wav"
    )
    print(f"Conversion done in {int(time.time() * 1000 - start_time)}ms")

    await exec_command(
        f"Rhubarb-Lip-Sync-1.13.0-Windows\\rhubarb.exe -f json -o audios/message_{message}.json audios/message_{message}.wav -r phonetic"
    )
    print(f"Lip sync done in {int(time.time() * 1000 - start_time)}ms")
    return read_json_transcript(f"audios/message_{message}.json")

async def exec_command(command):
    process = await subprocess.Popen(
        command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    stdout, stderr = await process.communicate()
    if process.returncode != 0:
        print(f"Command failed with error: {stderr.decode().strip()}")
    else:
        print(stdout.decode().strip())

import asyncio
import json
import aiofiles

async def read_json_transcript(file):
    async with aiofiles.open(file, mode='r', encoding='utf8') as f:
        data = await f.read()
    return json.loads(data)
# Example usage
# await lip_sync_message('example_message')
