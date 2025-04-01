
import { useNavigate } from "react-router-dom"
import  './style/RegisterStyle.css'
import React, { useState } from "react";
import Swal from 'sweetalert2';

export default function Register() {

  const navigate = useNavigate();

  const goToLogIn = () => {
    navigate("/sign-up");
  };

  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = (e) => {
    if (e.target.value !== '') {
      setHasContent(true);
    } else {
      setIsFocused(false);
      setHasContent(false);
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    prenume: '',
    username: '',
    gender: '',
    grupaSanguina: '',
    boliCronice: false,
    email: '',
    pacientPhoneNumber: '',
    height: '',
    weight: '',
    cnp: '',
    cetatenie: '',
    tara: '',
    judet: '',
    localitate: '',
    adresa: '',
    birthday: null,
    age: '',
  });

const handleInputChange = (event) => {
    if (event && event.target) {
      const { name, value, type, checked } = event.target;

      const newValue = name === 'birthday' ? value : value;
      const newAge = name === 'birthday' ? calculateAge(value) : formData.age;

      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : newValue,
        age: newAge
      });
    }
  };

const calculateAge = (birthdate) => {
    if (!birthdate) return '';

    const today = new Date();
    const birthDate = new Date(birthdate);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age.toString();
  };

  const handleSubmit = (event, date) => {
    event.preventDefault();
    
    // Check for empty fields
    const emptyFields = Object.keys(formData).filter((fieldName) => fieldName !== 'boliCronice' && !formData[fieldName]);
  
    if (emptyFields.length > 0) {
      // Display a SweetAlert for each empty field
      emptyFields.forEach((fieldName) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Please fill in the '${fieldName}' field`,
        });
      });
    } else {
      // No empty fields, proceed with form submission
      const medicalInfoData = { ...formData };
      
      fetch('https://localhost:80/medical-info/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicalInfoData),
      }).then((response) => {
          if (response.status === 201) {
            Swal.fire({icon: 'success', title: 'Success', text: 'User was added successfully!', timer: 1500});
            setFormData({
              name: '',
              prenume: '',
              username: '',
              gender: '',
              grupaSanguina: '',
              boliCronice: false,
              email: '',
              pacientPhoneNumber: '',
              height: '',
              weight: '',
              cnp: '',
              cetatenie: '',
              tara: '',
              judet: '',
              localitate: '',
              adresa: '',
              birthday: null,
              age: '',
            });
            // Reload the page
            window.location.reload();
          } else {
            // Handle errors
            response.json().then((errorResponse) => {
              if (errorResponse && errorResponse.message) {
                Swal.fire({ icon: 'error', title: 'Error', text: errorResponse.message });
              } else {
                Swal.fire({ icon: 'error', title: 'Error', text: 'An unexpected error occurred. Please try again.' });
              }
            });
          }
        }).catch(async (error) => {
          console.error('Error:', error);
        
          // Attempt to parse the error response as JSON
          let errorMessage = 'An unexpected error occurred. Please try again.';
        
          try {
            const errorResponse = await error.response.json();
            if (errorResponse && errorResponse.message) {
              errorMessage = errorResponse.message;
            }
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
          }
        
          Swal.fire({ icon: 'error', title: 'Error', text: errorMessage });
          alert(error);
        });      
    }
  };
  

  
  return(
    <>

      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-indigo-500" />
      
      <div className="center-container">
      <form className="formRegister">
    <p className="titleRegister">Register </p>
    <p className="messageRegister">Signup now and get full access to our app. </p>
        <div className="flexRegister">
        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    name="name"
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Firstname</span>
        </label>

        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.prenume}
                                    onChange={handleInputChange}
                                    name="prenume"
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Lastname</span>
        </label>
    </div>

    <label>
        <input required placeholder="" type="email" className="inputRegister"
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                value={formData.email}
                                onChange={handleInputChange}
                                name="email"
        />
        <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Email</span>
    </label>  

    <div className="flexRegister">        
        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    name="username"
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Username</span>
        </label> 
            

        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.pacientPhoneNumber}
                                    onChange={handleInputChange}
                                    name="pacientPhoneNumber"
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Phone Number</span>
        </label>
    </div>

    <div className="flexRegister">
        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    list="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    name="gender"
                                    
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Gender</span>
        </label>

        <label>
            <input required placeholder="" type="number" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    name="height"
                                    step={0.01}
                                    min={0}
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Height</span>
        </label>
        <label>
            <input required placeholder="" type="number" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    name="weight"
                                    step={0.01}
                                    min={0}
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Weight</span>
        </label>
        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    list="Sange"
                                    value={formData.grupaSanguina}
                                    onChange={handleInputChange}
                                    name="grupaSanguina"
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Blood Type</span>
        </label>
    </div> 

    <div className="flexRegister">
        <label>
            <input required placeholder="" type="date" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.birthday}
                                    onChange={handleInputChange}
                                    name="birthday"
            />
        </label>

        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.age}
                                    disabled
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Age</span>
        </label>
    </div>
    <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.cnp}
                                    onChange={handleInputChange}
                                    name="cnp"
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>CNP</span>
    </label>

    <div className="flexRegister">
        <label>
                <input required placeholder="" type="text" className="inputRegister"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        list="country"
                                        value={formData.tara}
                                        onChange={handleInputChange}
                                        name="tara"
                />
                <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Country</span>
        </label>
        <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={formData.cetatenie}
                                    onChange={handleInputChange}
                                    name="cetatenie"
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Cetatenie</span>
        </label>
    </div>

    <div className="flexRegister">
        <label>
                <input required placeholder="" type="text" className="inputRegister"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        list="Judet"
                                        value={formData.judet}
                                        onChange={handleInputChange}
                                        name="judet"
                />
                <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Judet</span>
        </label>
        <label>
                <input required placeholder="" type="text" className="inputRegister"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        value={formData.localitate}
                                        onChange={handleInputChange}
                                        name="localitate"
                />
                <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Localitate</span>
        </label>
        <label>
                <input required placeholder="" type="text" className="inputRegister"
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        value={formData.adresa}
                                        onChange={handleInputChange}
                                        name="adresa"
                />
                <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Adresa</span>
        </label>
    </div>

    <label className="container">
    <input  type="checkbox" onChange={handleInputChange} checked={formData.boliCronice} name="boliCronice" />
        <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="chevron-down"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>
    </label>
          {formData.boliCronice && (
            <>
            <label>
            <input required placeholder="" type="text" className="inputRegister"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
            />
            <span className={`spanRegister ${isFocused || hasContent ? 'active' : ''}`}>Boli cronice</span>
            </label>
            </>
          )}

    <button className="submitRegister" onClick={handleSubmit}>Submit</button>
    <p className="signinRegister">Already have an acount ? <a onClick={goToLogIn} href="#">Sign In</a> </p>
    </form>
    </div>

    <datalist id="gender">
        <option value="">Gender</option>
        <option value="masculin">masculin</option>
        <option value="feminin">feminin</option>
        <option value="non-binary">non-binary</option>
        <option value="transgender">transgender</option>
        <option value="other">other</option>
    </datalist>

    <datalist id="Sange">
        <option value="">Blood Type</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
    </datalist>

    <datalist id="Judet">
        <option value="Alba">AB</option>
        <option value="Arges">AG</option>
        <option value="Arad">AR</option>
        <option value="Bucuresti">B</option>
        <option value="Bacau">BC</option>
        <option value="Bihor">BH</option>
        <option value="Bistrita">BN</option>
        <option value="Braila">BR</option>
        <option value="Botosani">BT</option>
        <option value="Brasov">BV</option>
        <option value="Buzau">BZ</option>
        <option value="Cluj">CJ</option>
        <option value="Calarasi">CL</option>
        <option value="Caras-Severin">CS</option>
        <option value="Constanta">CT</option>
        <option value="Covasna">CV</option>
        <option value="Dambovita">DB</option>
        <option value="Dolj">DJ</option>
        <option value="Gorj">GJ</option>
        <option value="Galati">GL</option>
        <option value="Giurgiu">GR</option>
        <option value="Hunedoara">HD</option>
        <option value="Harghita">HG</option>
        <option value="Ilfov">IF</option>
        <option value="Ialomita">IL</option>
        <option value="Iasi">IS</option>
        <option value="Mehedinti">MH</option>
        <option value="Maramures">MM</option>
        <option value="Mures">MS</option>
        <option value="Neamt">NT</option>
        <option value="Olt">OT</option>
        <option value="Prahova">PH</option>
        <option value="Sibiu">SB</option>
        <option value="Salaj">SJ</option>
        <option value="Satu-Mare">SM</option>
        <option value="Suceava">SV</option>
        <option value="Tulcea">TL</option>
        <option value="Timis">TM</option>
        <option value="Teleorman">TR</option>
        <option value="Valcea">VL</option>
        <option value="Vrancea">VN</option>
        <option value="Vaslui">VS</option>
        </datalist>

        <datalist id="country">
        <option value="Afghanistan" />
        <option value="Albania" />
        <option value="Algeria" />
        <option value="American Samoa" />
        <option value="Andorra" />
        <option value="Angola" />
        <option value="Anguilla" />
        <option value="Antarctica" />
        <option value="Antigua and Barbuda" />
        <option value="Argentina" />
        <option value="Armenia" />
        <option value="Aruba" />
        <option value="Australia" />
        <option value="Austria" />
        <option value="Azerbaijan" />
        <option value="Bahamas" />
        <option value="Bahrain" />
        <option value="Bangladesh" />
        <option value="Barbados" />
        <option value="Belarus" />
        <option value="Belgium" />
        <option value="Belize" />
        <option value="Benin" />
        <option value="Bermuda" />
        <option value="Bhutan" />
        <option value="Bolivia" />
        <option value="Bosnia and Herzegovina" />
        <option value="Botswana" />
        <option value="Bouvet Island" />
        <option value="Brazil" />
        <option value="British Indian Ocean Territory" />
        <option value="Brunei Darussalam" />
        <option value="Bulgaria" />
        <option value="Burkina Faso" />
        <option value="Burundi" />
        <option value="Cambodia" />
        <option value="Cameroon" />
        <option value="Canada" />
        <option value="Cape Verde" />
        <option value="Cayman Islands" />
        <option value="Central African Republic" />
        <option value="Chad" />
        <option value="Chile" />
        <option value="China" />
        <option value="Christmas Island" />
        <option value="Cocos (Keeling) Islands" />
        <option value="Colombia" />
        <option value="Comoros" />
        <option value="Congo" />
        <option value="Congo, The Democratic Republic of The" />
        <option value="Cook Islands" />
        <option value="Costa Rica" />
        <option value="Cote D'ivoire" />
        <option value="Croatia" />
        <option value="Cuba" />
        <option value="Cyprus" />
        <option value="Czech Republic" />
        <option value="Denmark" />
        <option value="Djibouti" />
        <option value="Dominica" />
        <option value="Dominican Republic" />
        <option value="Ecuador" />
        <option value="Egypt" />
        <option value="El Salvador" />
        <option value="Equatorial Guinea" />
        <option value="Eritrea" />
        <option value="Estonia" />
        <option value="Ethiopia" />
        <option value="Falkland Islands (Malvinas)" />
        <option value="Faroe Islands" />
        <option value="Fiji" />
        <option value="Finland" />
        <option value="France" />
        <option value="French Guiana" />
        <option value="French Polynesia" />
        <option value="French Southern Territories" />
        <option value="Gabon" />
        <option value="Gambia" />
        <option value="Georgia" />
        <option value="Germany" />
        <option value="Ghana" />
        <option value="Gibraltar" />
        <option value="Greece" />
        <option value="Greenland" />
        <option value="Grenada" />
        <option value="Guadeloupe" />
        <option value="Guam" />
        <option value="Guatemala" />
        <option value="Guinea" />
        <option value="Guinea-bissau" />
        <option value="Guyana" />
        <option value="Haiti" />
        <option value="Heard Island and Mcdonald Islands" />
        <option value="Holy See (Vatican City State)" />
        <option value="Honduras" />
        <option value="Hong Kong" />
        <option value="Hungary" />
        <option value="Iceland" />
        <option value="India" />
        <option value="Indonesia" />
        <option value="Iran, Islamic Republic of" />
        <option value="Iraq" />
        <option value="Ireland" />
        <option value="Israel" />
        <option value="Italy" />
        <option value="Jamaica" />
        <option value="Japan" />
        <option value="Jordan" />
        <option value="Kazakhstan" />
        <option value="Kenya" />
        <option value="Kiribati" />
        <option value="Korea, Democratic People's Republic of" />
        <option value="Korea, Republic of" />
        <option value="Kuwait" />
        <option value="Kyrgyzstan" />
        <option value="Lao People's Democratic Republic" />
        <option value="Latvia" />
        <option value="Lebanon" />
        <option value="Lesotho" />
        <option value="Liberia" />
        <option value="Libyan Arab Jamahiriya" />
        <option value="Liechtenstein" />
        <option value="Lithuania" />
        <option value="Luxembourg" />
        <option value="Macao" />
        <option value="Macedonia, The Former Yugoslav Republic of" />
        <option value="Madagascar" />
        <option value="Malawi" />
        <option value="Malaysia" />
        <option value="Maldives" />
        <option value="Mali" />
        <option value="Malta" />
        <option value="Marshall Islands" />
        <option value="Martinique" />
        <option value="Mauritania" />
        <option value="Mauritius" />
        <option value="Mayotte" />
        <option value="Mexico" />
        <option value="Micronesia, Federated States of" />
        <option value="Moldova, Republic of" />
        <option value="Monaco" />
        <option value="Mongolia" />
        <option value="Montserrat" />
        <option value="Morocco" />
        <option value="Mozambique" />
        <option value="Myanmar" />
        <option value="Namibia" />
        <option value="Nauru" />
        <option value="Nepal" />
        <option value="Netherlands" />
        <option value="Netherlands Antilles" />
        <option value="New Caledonia" />
        <option value="New Zealand" />
        <option value="Nicaragua" />
        <option value="Niger" />
        <option value="Nigeria" />
        <option value="Niue" />
        <option value="Norfolk Island" />
        <option value="Northern Mariana Islands" />
        <option value="Norway" />
        <option value="Oman" />
        <option value="Pakistan" />
        <option value="Palau" />
        <option value="Palestinian Territory, Occupied" />
        <option value="Panama" />
        <option value="Papua New Guinea" />
        <option value="Paraguay" />
        <option value="Peru" />
        <option value="Philippines" />
        <option value="Pitcairn" />
        <option value="Poland" />
        <option value="Portugal" />
        <option value="Puerto Rico" />
        <option value="Qatar" />
        <option value="Reunion" />
        <option value="Romania" />
        <option value="Russian Federation" />
        <option value="Rwanda" />
        <option value="Saint Helena" />
        <option value="Saint Kitts and Nevis" />
        <option value="Saint Lucia" />
        <option value="Saint Pierre and Miquelon" />
        <option value="Saint Vincent and The Grenadines" />
        <option value="Samoa" />
        <option value="San Marino" />
        <option value="Sao Tome and Principe" />
        <option value="Saudi Arabia" />
        <option value="Senegal" />
        <option value="Serbia and Montenegro" />
        <option value="Seychelles" />
        <option value="Sierra Leone" />
        <option value="Singapore" />
        <option value="Slovakia" />
        <option value="Slovenia" />
        <option value="Solomon Islands" />
        <option value="Somalia" />
        <option value="South Africa" />
        <option value="South Georgia and The South Sandwich Islands" />
        <option value="Spain" />
        <option value="Sri Lanka" />
        <option value="Sudan" />
        <option value="Suriname" />
        <option value="Svalbard and Jan Mayen" />
        <option value="Swaziland" />
        <option value="Sweden" />
        <option value="Switzerland" />
        <option value="Syrian Arab Republic" />
        <option value="Taiwan, Province of China" />
        <option value="Tajikistan" />
        <option value="Tanzania, United Republic of" />
        <option value="Thailand" />
        <option value="Timor-leste" />
        <option value="Togo" />
        <option value="Tokelau" />
        <option value="Tonga" />
        <option value="Trinidad and Tobago" />
        <option value="Tunisia" />
        <option value="Turkey" />
        <option value="Turkmenistan" />
        <option value="Turks and Caicos Islands" />
        <option value="Tuvalu" />
        <option value="Uganda" />
        <option value="Ukraine" />
        <option value="United Arab Emirates" />
        <option value="United Kingdom" />
        <option value="United States" />
        <option value="United States Minor Outlying Islands" />
        <option value="Uruguay" />
        <option value="Uzbekistan" />
        <option value="Vanuatu" />
        <option value="Venezuela" />
        <option value="Viet Nam" />
        <option value="Virgin Islands, British" />
        <option value="Virgin Islands, U.S" />
        <option value="Wallis and Futuna" />
        <option value="Western Sahara" />
        <option value="Yemen" />
        <option value="Zambia" />
        <option value="Zimbabwe" />
    </datalist>
    </>
  )
}
