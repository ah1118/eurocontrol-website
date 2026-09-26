```javascript
const API_BASE =
    "https://eurocontrol-api-722236408667.us-central1.run.app";

const aircraftInput = document.getElementById("aircraft");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");

function setValue(id, value) {
    const element = document.getElementById(id);

    if (value === null || value === undefined || value === "") {
        element.textContent = "—";
    } else {
        element.textContent = value;
    }
}

function showLoading(show) {
    loading.classList.toggle("hidden", !show);
    searchButton.disabled = show;
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
}

function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
}

function displayFlight(data) {
    setValue("aircraftValue", data.aircraft);
    setValue("flightIdValue", data.flight_id);

    setValue("departureValue", data.departure);
    setValue("destinationValue", data.destination);

    setValue("ctotValue", data.ctot);

    setValue("eobtValue", data.eobt);
    setValue("atfmMessageValue", data.atfm_message);
    setValue("directionValue", data.direction);
    setValue("originatorValue", data.originator);

    setValue(
        "calculatedTakeoffValue",
        data.calculated_takeoff_time
    );

    setValue(
        "estimatedTakeoffValue",
        data.estimated_takeoff_time
    );

    setValue(
        "actualTakeoffValue",
        data.actual_takeoff_time
    );

    setValue("delayValue", data.atfm_delay);
    setValue("slotValue", data.slot_issued);

    setValue(
        "regulationValue",
        data.most_penalising_regulation
    );

    results.classList.remove("hidden");
}

async function searchFlight() {
    const aircraft = aircraftInput.value.trim().toUpperCase();

    clearError();

    if (!aircraft) {
        results.classList.add("hidden");
        showError("Please enter an aircraft ID.");
        aircraftInput.focus();
        return;
    }

    showLoading(true);

    try {
        const url =
            API_BASE +
            "/flight?aircraft=" +
            encodeURIComponent(aircraft);

        const response = await fetch(url);

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error(
                "Server returned HTTP " + response.status
            );
        }

        if (!response.ok) {
            const details =
                data.details ||
                data.error ||
                "HTTP " + response.status;

            throw new Error(details);
        }

        displayFlight(data);

    } catch (error) {
        results.classList.add("hidden");

        if (error instanceof TypeError) {
            showError(
                "Unable to contact the EUROCONTROL API. " +
                "Check the API connection and CORS configuration."
            );
        } else {
            showError(error.message);
        }

    } finally {
        showLoading(false);
    }
}

searchButton.addEventListener("click", searchFlight);

aircraftInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchFlight();
    }
});

aircraftInput.focus();
```
