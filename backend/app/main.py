from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
print("MAIN.PY LOADED")

app = FastAPI()

# Allow React (Vercel) to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to your data folder
#DATA_DIR = Path("../data")
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


COHORT_FILE = DATA_DIR / "ispy2_top20_v7_optionB_fullcohort_with_modelA.json"


def load_cohort():
    with open(COHORT_FILE, "r") as f:
        data = json.load(f)

    print("Loaded JSON type:", type(data))
    print("Top-level keys:", data.keys() if isinstance(data, dict) else "list")

    if isinstance(data, list):
        return data

    if isinstance(data, dict) and "patients" in data:
        return data["patients"]

    return []




@app.get("/")
def root():
    return {"status": "Backend running"}


@app.get("/patients")
def get_patients():
    patients = load_cohort()
    ids = []

    for p in patients:
        pid = (
            p.get("patient_id")
            or p.get("patient_key")
            or p.get("Patient_ID")
            or p.get("id")
        )
        if pid:
            ids.append(str(pid))

    return ids

@app.get("/patient/{pid}")
def get_patient(pid: str):
    patients = load_cohort()

    for p in patients:
        p_id = (
            p.get("patient_id")
            or p.get("patient_key")
            or p.get("Patient_ID")
            or p.get("id")
        )
        if str(p_id) == pid:
            return p

    return {"error": "Patient not found"}


@app.get("/patient/{pid}/omics")
def get_patient_omics(pid: str):
    patients = load_cohort()

    for p in patients:
        p_id = (
            p.get("patient_id")
            or p.get("patient_key")
            or p.get("Patient_ID")
            or p.get("id")
        )
        if str(p_id) == pid:
            return {
                "mrna": p.get("omics", {}).get("mRNA", {}).get("z_scores", {}),
                "rppa": p.get("omics", {}).get("RPPA", {}).get("z_scores", {})
            }

    return {"error": "Patient not found"}

@app.get("/patient/{pid}/regimens")
def get_patient_regimens(pid: str):
    patients = load_cohort()

    for p in patients:
        p_id = (
            p.get("patient_id")
            or p.get("patient_key")
            or p.get("Patient_ID")
            or p.get("id")
        )
        if str(p_id) == pid:
            return p.get("trial_regimen_prediction", {})

    return {"error": "Patient not found"}



@app.get("/patient/{patient_id}/drivers")
def get_patient_drivers(patient_id: str):

    data = load_cohort()

    print("TOTAL PATIENTS:", len(data))

    patient = None
    for p in data:
        if str(p.get("patient_key")) == str(patient_id):
            patient = p
            break

    if patient is None:
        return {}

    print("FOUND PATIENT:", patient["patient_key"])

    evidence = patient.get("evidence_triage", {})
    drivers = evidence.get("omics_driver_support", {})

    print("DRIVERS:", drivers)

    return drivers


