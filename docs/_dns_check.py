"""DNS resolution check for Vercel URLs."""
import socket

for h in [
    "fciaz.vercel.app",
    "fciaz-3zphhvyly-dalisots-projects.vercel.app",
    "vercel.com",
]:
    try:
        ips = socket.gethostbyname_ex(h)
        print(f"  {h} -> {ips[2]}")
    except Exception as e:
        print(f"  {h} -> FAILED: {e}")
