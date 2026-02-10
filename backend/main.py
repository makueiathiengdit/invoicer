from fastapi import FastAPI


app = FastAPI(title="Invoice Recorder")

@app.get("/")
def home():
    return {"status":"ok"}
