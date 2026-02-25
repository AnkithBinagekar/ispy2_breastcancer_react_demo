from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import json
import subprocess

print("MAIN.PY LOADED")

app = FastAPI()

# Allow React to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
COHORT_FILE = DATA_DIR / "ispy2_top20_v7_optionB_fullcohort_with_modelA.json"

def load_cohort():
    try:
        with open(COHORT_FILE, "r") as f:
            data = json.load(f)
        if isinstance(data, list):
            return data
        if isinstance(data, dict) and "patients" in data:
            return data["patients"]
        return []
    except Exception as e:
        print(f"Error loading cohort: {e}")
        return []

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.get("/patients")
def get_patients():
    patients = load_cohort()
    return [
        str(p.get("patient_key") or p.get("patient_id") or p.get("id"))
        for p in patients if p.get("patient_key") or p.get("patient_id") or p.get("id")
    ]

@app.get("/patient/{pid}/omics")
def get_patient_omics(pid: str):
    patients = load_cohort()
    for p in patients:
        p_id = str(p.get("patient_key") or p.get("patient_id") or p.get("id"))
        if p_id == pid:
            return {
                "mrna": p.get("omics", {}).get("mRNA", {}).get("z_scores", {}),
                "rppa": p.get("omics", {}).get("RPPA", {}).get("z_scores", {}),
                "subtype": p.get("labels", {}).get("subtype", "—"),
                "arm": p.get("labels", {}).get("trial_arm", "—")
            }
    raise HTTPException(status_code=404, detail="Patient not found")

@app.get("/patient/{pid}/regimens")
def get_patient_regimens(pid: str):
    patients = load_cohort()
    for p in patients:
        p_id = str(p.get("patient_key") or p.get("patient_id") or p.get("id"))
        if p_id == pid:
            return p.get("trial_regimen_prediction", {})
    raise HTTPException(status_code=404, detail="Patient not found")

@app.get("/patient/{pid}/drivers")
def get_patient_drivers(pid: str):
    patients = load_cohort()
    for p in patients:
        p_id = str(p.get("patient_key") or p.get("patient_id") or p.get("id"))
        if p_id == pid:
            return p.get("evidence_triage", {}).get("omics_driver_support", {})
    raise HTTPException(status_code=404, detail="Patient not found")

# --- INFERENCE ENGINE ---
class InferenceRequest(BaseModel):
    patient_json: str
    models_dir: str
    infer_script: str
    vocab_path: str = ""
    modalities: str = "mrna,rppa"

@app.post("/run-inference")
def run_inference(req: InferenceRequest):
    try:
        # Build command exactly as Streamlit did
        cmd = [
            "python", req.infer_script,
            "--patient_json", req.patient_json,
            "--models_dir", req.models_dir,
            "--modalities", req.modalities
        ]
        if req.vocab_path:
            cmd.extend(["--vocab", req.vocab_path])

        # Execute the python script
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        # Read the newly generated/modified JSON file
        with open(req.patient_json, 'r') as f:
            updated_record = json.load(f)
            
        return {"status": "success", "data": updated_record}
        
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e.stderr}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))