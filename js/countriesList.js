const { createApp } = Vue;

createApp({
    data() {
        return {
            countries: [] // Array to store country information
        };
    },
    methods: {
        // Fetch data from the API
        async fetchCountries() {
            try {
                const response = await axios.get('http://localhost:8080/api/countries'); // Replace 'X' with your endpoint URL
                this.countries = response.data; // Assumes the API returns an array of countries
            } catch (error) {
                console.error('Error fetching data:', error);
                this.countries = []; // Set empty if API call fails
            }
        },
        // Manual refresh logic
        refreshData() {
            this.fetchCountries(); // Re-fetch data from the API
        }
    },
    mounted() {
        // Fetch data when the component is mounted
        this.fetchCountries();
    }
}).mount('#app');