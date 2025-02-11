const { createApp, ref } = Vue;

createApp({
    setup() {
        // Create reactive references for storing the cities array and table headings
        const cities = ref([]);
        const headings = ref([]);

        // Fetch the city data from the API and update the reactive variables
        const fetchCities = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/cities");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                cities.value = data; // Assign the fetched JSON to 'cities'

                // Dynamically create table headings from the keys of the first object
                if (data.length > 0) {
                    headings.value = Object.keys(data[0]);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        // Fetch data on component mount
        fetchCities();

        return { cities, headings };
    }
}).mount("#app");