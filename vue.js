const { createApp, ref} = Vue;

createApp({
    setup() {
        // Reactive state for data storage
        const tableData = ref([]);  // Stores the fetched data
        const headings = ref([]);   // Stores the table headings
        const newCity = ({
            cityName: '',
            population: null,
            province: '',
            country: ''
        }); // Stores the city object
        const tableHeading = ref(""); // Stores the table heading


        // API Call to fetch data dynamically based on the selected button
        const fetchData = async (endpoint) => {
            try {
                const response = await fetch(`http://localhost:8080/api/${endpoint}`)
                const data = await response.json();
                if (!data || data.length === 0) {
                    tableData.value = [];
                    headings.value = [];
                } else {
                    tableData.value = data;
                    headings.value = Object.keys(data[0]);  // Extract column headers
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                tableData.value = [];
            }
        };
        // Defines the table header
        const fetchAndDefineHeader = async (endpoint) => {
            tableHeading.value = endpoint;
            await fetchData(endpoint);
        }
        // API Call to find cities by country
        const findCitiesByCountry = async () => {
            const country = document.getElementById("cityFilter").value.trim();
            if (!country) return;
            tableHeading.value = "Cities in " + country;
            await fetchData(`countries/${country}/cities`);
        };
        // API Call to find a continent by name
        const findContinentByName = async () => {
            const continent = document.getElementById("continentFilter").value.trim();
            if (!continent) return;
            tableHeading.value = "Regions in " + continent;
            await fetchData(`continents/${continent}/regions`);
        };
        // API Call to add a new city
        const addCity = async () => {
            try {
                console.log("attempting to add city");
                const response = await fetch('http://localhost:8080/api/cities', { // Replace with your own backend URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCity)
                });
                if (response.status === 200) {
                    alert("City added successfully!");
                    await fetchData(`cities/${newCity.cityName}`);

                    newCity.cityName = "";
                    newCity.province = "";
                    newCity.population = null;
                    newCity.country = "";
                }
            } catch (error) {
                console.error("Error adding city:", error);
            }
        };
        // API Call to delete a city by ID
        const deleteCity = async () => {
            const cityId = document.getElementById("deleteCity").value.trim();
            if (!cityId) return;
            const response = await fetch(`http://localhost:8080/api/cities/${cityId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if(response.ok) {
                    alert("City deleted successfully!");
                    tableHeading.value = "cities";
                    fetchData("cities");
                }
                else{
                    alert("City not found!");
                }
            })
        }
        // API Call to find city by name
        const findCityByName = async () => {
            const name = document.getElementById("findCityByName").value.trim();
            if (!name) return;
            tableHeading.value = "cities named: " + name;
            await fetchData(`cities/${name}`);
        }
        // API Call to get all continents
        const getContinents = async () => {
            const name = document.getElementById("findContinentByName").value.trim();
            if (!name) return;
            tableHeading.value = "Continents named: " + name;
            await fetchData(`continents/${name}`);
        }
        //Returns all elements used  on the webapp
        return {
            //Variables
            tableData,
            headings,
            newCity,
            tableHeading,
            //Functions
            findCityByName,
            getContinents,
            fetchData,
            addCity,
            findCitiesByCountry,
            findContinentByName,
            fetchAndDefineHeader,
            deleteCity
        };
    },

    template: `
<div class="organizer">
    <div class="form-container">
      <div class="form-group">
        <label for="findContinentByName">Find Continent by name (Broken)</label>
        <input id="findContinentByName" name="findContinentByName" type="text" placeholder="Enter the Continent name" required>
      </div>
      <button class="submit-button" @click="getContinents">Find</button>
    </div>
    <div class="form-container">
      <div class="form-group">
        <label for="continentFilter">Find region by Continet</label>
        <input id="continentFilter" name="country" type="text" placeholder="Enter continent" required>
      </div>
      <button class="submit-button" @click="findContinentByName">Find</button>
    </div>
    <div class="form-container">
      <div class="form-group">
        <label for="cityFilter">Find cities by country</label>
        <input id="cityFilter" name="city" type="text" placeholder="Enter country" required>
      </div>
      <button class="submit-button" @click="findCitiesByCountry">Find</button>
    </div>
    <div class="form-container">
      <div class="form-group">
        <label for="findCityByName">Find city by name</label>
        <input id="findCityByName" name="findCityByName" type="text" placeholder="Enter the city name" required>
      </div>
      <button class="submit-button" @click="findCityByName">Find</button>
    </div>
</div>
<div class="organizerLarge">
  <div class="form-container">
    <div class="Links">
      <div class="Buttons">
        <button class="submit-button" @click="fetchAndDefineHeader('cities')">List all Cities</button>
        <button class="submit-button" @click="fetchAndDefineHeader('continents')">List all Continents</button>
        <button class="submit-button" @click="fetchAndDefineHeader('countries')">List all Countries</button>
        <button class="submit-button" @click="fetchAndDefineHeader('regions')">List all Regions</button>
      </div>
    </div>
  </div>
  <div class="form-container" v-if="tableData.length > 0">
    <h1>List of {{ tableHeading }}</h1>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th v-for="heading in headings" :key="heading">{{ heading }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in tableData" :key="row.id">
            <td v-for="(value, key) in row" :key="key">
              {{ typeof value === "object" && value !== null ? value.name : value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="form-container" v-if="tableData.length === 0">
    <p>No data available</p>
  </div>
</div>
<div class="organizer">
  <div class="form-container">
    <h1>Add a New City</h1>
    <div class="form-group">
      <label for="cityName">City Name:</label>
      <input type="text" id="cityName" v-model="newCity.cityName" placeholder="Enter city name" required>
    </div>

    <div class="form-group">
      <label for="province">Province/State:</label>
      <input type="text" id="province" v-model="newCity.province" placeholder="Enter province/state" required>
    </div>

    <div class="form-group">
      <label for="population">Population:</label>
      <input type="number" id="population" v-model="newCity.population" placeholder="Enter population" required>
    </div>

    <div class="form-group">
      <label for="country">Country:</label>
      <input type="text" id="country" v-model="newCity.country" placeholder="Enter country" required>
    </div>

    <div class="form-group">
      <button type="submit" class="submit-button" @click="addCity">Add city</button>
    </div>
  </div>
  <div class="form-container">
      <div class="form-group">
        <label for="deleteCity">Delete city by ID</label>
        <input id="deleteCity" name="delete" type="text" placeholder="Enter the city ID" required>
      </div>
      <button class="delete-button" @click="deleteCity">Delete</button>
    </div>
</div>
    `
}).mount("#app");
