const aircraftInput = document.getElementById("aircraft");
const searchButton = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");


function setValue(id, value) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        element.textContent = "—";
    } else {
        element.textContent = value;
    }
}


function showLoading(show) {
    loading.classList.toggle("hidden", !show);
    searchButton.disabled = show;

    if (show) {
        searchButton.textContent = "Searching...";
    } else {
        searchButton.textContent = "Search Flight";
    }
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

    setValue(
        "aircraftValue",
        data.aircraft
    );

    setValue(
        "flightIdValue",
        data.flight_id
    );

    setValue(
        "departureValue",
        data.departure
    );

    setValue(
        "destinationValue",
        data.destination
    );

    setValue(
        "ctotValue",
        data.ctot
    );

    setValue(
        "eobtValue",
        data.eobt
    );

    setValue(
        "atfmMessageValue",
        data.atfm_message
    );

    setValue(
        "directionValue",
        data.direction
    );

    setValue(
        "originatorValue",
        data.originator
    );

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

    setValue(
        "delayValue",
        data.atfm_delay
    );

    setValue(
        "slotValue",
        data.slot_issued
    );

    setValue(
        "regulationValue",
        data.most_penalising_regulation
    );

    results.classList.remove("hidden");
}


async function searchFlight() {

    const aircraft =
        aircraftInput.value.trim().toUpperCase();

    clearError();

    if (!aircraft) {

        results.classList.add("hidden");

        showError(
            "Please enter an aircraft ID."
        );

        aircraftInput.focus();

        return;
    }

    showLoading(true);

    try {

        const url =
            "/flight?aircraft=" +
            encodeURIComponent(aircraft);

        console.log(
            "Requesting flight:",
            aircraft
        );

        const response =
            await fetch(url);

        let data;

        try {

            data =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Server returned HTTP " +
                response.status +
                " but did not return valid JSON."
            );
        }


        if (!response.ok) {

            const details =
                data.details ||
                data.error ||
                "HTTP " +
                response.status;

            throw new Error(details);
        }


        displayFlight(data);

    } catch (error) {

        results.classList.add("hidden");

        console.error(
            "Flight search error:",
            error
        );


        if (
            error instanceof TypeError
        ) {

            showError(
                "Unable to contact the EUROCONTROL API. " +
                "Please check the network connection."
            );

        } else {

            showError(
                error.message ||
                "An unexpected error occurred."
            );
        }

    } finally {

        showLoading(false);
    }
}


searchButton.addEventListener(
    "click",
    searchFlight
);


aircraftInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchFlight();
        }
    }
);


aircraftInput.focus();
