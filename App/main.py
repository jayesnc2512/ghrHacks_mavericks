import asyncio
import websockets
import json

async def alert_server(websocket, path):
    while True:
        # Simulate detecting an alert (this could be your actual alert logic)
        await asyncio.sleep(25)  # Every 5 seconds
        alert = {
            "title": "Alert Detected",
            "message": "An alert has been detected on the server!"
        }
        # Send the alert to the connected client
        await websocket.send(json.dumps(alert))

# Start WebSocket server on port 8080
start_server = websockets.serve(alert_server, "0.0.0.0", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
