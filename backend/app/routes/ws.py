from fastapi import WebSocket, WebSocketDisconnect
import asyncio

# Store active WebSocket connections
connected_clients = []

async def websocket_endpoint(websocket: WebSocket):
    """ WebSocket endpoint to handle client connections. """
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received: {data}")
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        print("Client disconnected")

async def send_websocket_message(message: str):
    """ Broadcast a message to all connected WebSocket clients. """
    for client in connected_clients:
        try:
            await client.send_text(message)
        except Exception:
            connected_clients.remove(client)  # Remove disconnected clients
def send_message_sync(message: str):
    """Runs the async WebSocket function in a separate event loop (for threads)."""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(send_websocket_message(message))
    loop.close()