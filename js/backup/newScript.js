const { createApp, ref } = Vue;

// Define the CityRow component for rendering a single row in the table.
const CityRow = {
    props: ["city"],
    template: `
        <tr>
            <td v-for="(value, key) in city" :key="key">
                {{ typeof value === "object" && value !== null ? value.name ?? "[Object]" : value }}
            </td>
        </tr>
    `
};

// Define the CitiesTable component
const CitiesTable = {
    components: { CityRow }, // Register the CityRow component

    setup() {
        const cities = ref([]); // List of cities
        const headings = ref([]); // Table column headers

        // Reactive properties for the new city form
        const newCity = ref({
            name: "",
            country: ""
        });

        const fetchCities = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/cities");
                cities.value = await response.json();
                headings.value = cities.value.length ? Object.keys(cities.value[0]) : [];
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        fetchCities(); // Fetch cities when component is mounted

        return { cities, headings, newCity, fetchCities };
    },

    template: `
        <div>
            <h2>Cities</h2>
            <table>
                <thead>
                    <tr>
                        <th v-for="(heading, index) in headings" :key="index">{{ heading }}</th>
                    </tr>
                </thead>
                <tbody>
                    <CityRow v-for="(city, index) in cities" :key="index" :city="city" />
                </tbody>
            </table>
        </div>
    `
};

// Mount the app
createApp(CitiesTable).mount("#app");
