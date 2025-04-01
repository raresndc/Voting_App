import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
  Input,
  CardHeader,
  Checkbox,
  Switch,
  MenuHandler,
  IconButton,
  Menu,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useEffect } from "react";
import {
  changeNotificationsStatusApi,
  changePasswordApi,
  getCurrentUserApi,
  changePhoneNumberByUserApi,
  changeMailApi,
  changeFullAdress,
} from "session/BackendApi.ts";
import GlobalState from "session/GlobalState.ts";
import { CreateUserDao, UserDao } from "session/dao/Dao.ts";
import Swal from "sweetalert2";
import { Collapse } from "react-collapse";
import { PaginationModel } from "components/PaginationModel";
import { PageableTemplate } from "session/dao/PageableDao";
import { RouterDao } from "pages/routers/dao/RouterDao";
import {
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  WifiIcon,
} from "@heroicons/react/24/solid";

import "./style/ProfileStyles.css";

export default function Profile() {
  const [createUser, setCreateUser] = useState<CreateUserDao>({
    newPassword: "",
    role: "",
    username: GlobalState.username,
    phoneNumberString: "",
    oldPassword: "",
    email: "",
    tara: "",
    judet: "",
    localitate: "",
    adresa: "",
    notificationSms: null,
  });
  const [user, setUser] = useState<UserDao>();

  const [repeatPassword, setRepeatPassword] = useState("");

  const regexPass = new RegExp(
    "(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_]).{8,24}"
  );
  const regexPhoneNumber = new RegExp("^[0-9]{10}$");
  const regexEmail = new RegExp(
    "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$"
  );

  const [isChecked, setIsChecked] = useState(user?.notificationSms);

  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((cur) => !cur);

  const [collapseOpen, setCollapseOpen] = useState(false);

  const [pagination, setPagination] = useState<PaginationModel>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [entity, setEntity] = useState<PageableTemplate<RouterDao>>();
  const [modifyState, setModifyState] = useState(false);

  const toggleCollapse = () => {
    reloadState();
    setCollapseOpen(!collapseOpen);
  };

  useEffect(() => {}, [modifyState, pagination]);

  function reloadState() {
    setModifyState(!modifyState);
  }

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const label = isChecked ? "Notificari activate" : "Notificari dezactivate";

  useEffect(() => {
    getCurrentUserApi().then((res) => setUser(res));
  }, []);

  async function modifyPassword(ev) {
    ev.preventDefault();
    try {
      if (!regexPass.test(createUser.newPassword)) {
        Swal.fire({
          icon: "error",
          title: "Eroare",
          text: "Parola nu respecta constrangerile. Litera mica, litera mare, cifra, caracter special(#?!@$%^&*-_) si dimensiune minim 8 caractere, dimensiune maxima 24 de caractere!",
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        return;
      }

      if (createUser.newPassword !== repeatPassword) {
        Swal.fire({
          icon: "error",
          title: "Eroare",
          text: "Campul parola nu este acelasi cel de repeta parola!",
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        return;
      }

      Swal.fire({
        title: "Loading ... ",
        text: "Asteptati modificarea parolei.",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await changePasswordApi(createUser);

      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Parola a fost modificata cu succes!",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Eroare",
        text: err,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    }
  }

  async function modifyNotifications(ev) {
    ev.preventDefault();
    try {
      Swal.fire({
        title: "Loading ... ",
        text: "Asteptati modificarea statusului.",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await changeNotificationsStatusApi({
        notificationSms: user?.notificationSms,
        username: user?.username,
      });

      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Status notificari a fost modificat cu succes!",
      });

      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'Succes!',
      //   text: 'Status notificari a fost modificat cu succes!',
      //   showConfirmButton: false,
      //   timer: 1500,
      //   allowEscapeKey: false,
      //   allowOutsideClick: false
      // })
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Eroare",
        text: err,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    }
  }

  async function modifyPhoneNumber(ev) {
    ev.preventDefault();
    try {
      if (!regexPhoneNumber.test(user.phoneNumberString)) {
        Swal.fire({
          icon: "error",
          title: "Eroare",
          text: "Numarul de telefon trebuie sa aiba fix 10 cifre!",
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        return;
      }
      Swal.fire({
        title: "Loading ... ",
        text: "Asteptati modificarea numarului de telefon.",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await changePhoneNumberByUserApi(user);

      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Numarul de telefon a fost modificat cu succes!",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Eroare",
        text: err,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    }
  }

  async function modifyMail(ev) {
    ev.preventDefault();
    try {
      if (!regexEmail.test(user.email)) {
        Swal.fire({
          icon: "error",
          title: "Eroare",
          text: "Formatul email-ului este incorect",
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        return;
      }
      Swal.fire({
        title: "Loading ... ",
        text: "Asteptati modificarea email-ului.",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await changeMailApi(user);

      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Email-ul a fost modificat cu succes!",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Eroare",
        text: err,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    }
  }

  async function modifyFullAdress(ev) {
    ev.preventDefault();
    try {
      // if(!regexEmail.test(user.email)) {
      //     Swal.fire({icon: 'error', title: 'Eroare', text: 'Formatul email-ului este incorect', allowEscapeKey: false, allowOutsideClick: false})
      //     return
      // }
      Swal.fire({
        title: "Loading ... ",
        text: "Asteptati modificarea datelor.",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await changeFullAdress(user);

      Swal.fire({
        icon: "success",
        title: "Succes!",
        text: "Datele au fost modificat cu succes!",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Eroare",
        text: err,
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
    }
  }

  return (
    <>
      <Card className="mx-3 mt-10 mb-6 lg:mx-4">
        <CardHeader
          variant="gradient"
          color="indigo"
          className="mb-8 p-6 bg-gradient-to-r from-gray-300 to-indigo-100 bg-cover"
        >
          <Typography variant="h6" color="gray">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Credentials</span>
              <div>
                <Typography variant="h6" color="indigo" className="mb-1">
                  {GlobalState.username}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-amber-900"
                >
                  {GlobalState.role}
                </Typography>
              </div>
            </div>
          </Typography>
        </CardHeader>

        <CardBody className="p-4">
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-1 justify-items-center">
            <form className="mt-1 mb-2 w-80 max-w-screen-lg sm:w-96 lg:p-0 p-7">
              <div className="mb-4 flex flex-col gap-6">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    color="blue-gray-500"
                    className="mb-1"
                  >
                    Change personal info
                  </Typography>
                </div>

                <Input
                  value={createUser.oldPassword}
                  type="password"
                  size="lg"
                  label="Old password"
                  onChange={(e) => {
                    setCreateUser({
                      ...createUser,
                      oldPassword: e.target.value,
                    });
                  }}
                />
                <Input
                  value={createUser.newPassword}
                  type="password"
                  size="lg"
                  label="New password"
                  onChange={(e) => {
                    setCreateUser({
                      ...createUser,
                      newPassword: e.target.value,
                    });
                  }}
                />
                <Input
                  value={repeatPassword}
                  type="password"
                  size="lg"
                  label="Repeat new password"
                  onChange={(e) => {
                    setRepeatPassword(e.target.value);
                  }}
                />

                <div>
                  <div className="mb-4 flex flex-col gap-6">
                    <button onClick={modifyPassword} className="buttonDeviceType">
                      Modify
                    </button>
                  </div>

                  <div>
                    <div className="mb-4 mt-10 flex flex-col gap-6">
                      <Input
                        maxLength={10}
                        value={user?.phoneNumberString}
                        required
                        size="lg"
                        label="Phone number"
                        onChange={(e) => {
                          setUser({
                            ...user,
                            phoneNumberString: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="mb-4 flex flex-col gap-6">
                      <button
                        onClick={modifyPhoneNumber}
                        className="buttonDeviceType"
                      >
                        Modify Phone No.
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 mt-10 flex flex-col gap-6">
                      <Input
                        value={user?.email}
                        required
                        size="lg"
                        label="E-mail"
                        onChange={(e) => {
                          setUser({ ...user, email: e.target.value });
                        }}
                      />
                    </div>
                    <div className="mb-4 flex flex-col gap-6">
                      <button onClick={modifyMail} className="buttonDeviceType">
                        Modify E-mail
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 mt-10 flex flex-col gap-6">
                      <Input
                        value={user?.tara}
                        list="country"
                        required
                        size="lg"
                        label="Country"
                        onChange={(e) => {
                          const capitalizedInput =
                            e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1);
                          setUser({ ...user, tara: capitalizedInput });
                        }}
                      />

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
                      <Input
                        value={user?.judet}
                        list="Judet"
                        required
                        size="lg"
                        label="Judet"
                        onChange={(e) => {
                          const capitalizedInput =
                            e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1);
                          setUser({ ...user, judet: capitalizedInput });
                        }}
                      />
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

                      <Input
                        value={user?.localitate}
                        required
                        size="lg"
                        label="Localitate"
                        onChange={(e) => {
                          const capitalizedInput =
                            e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1);
                          setUser({ ...user, localitate: capitalizedInput });
                        }}
                      />
                      <Input
                        value={user?.adresa}
                        required
                        size="lg"
                        label="Adress"
                        onChange={(e) => {
                          const capitalizedInput =
                            e.target.value.charAt(0).toUpperCase() +
                            e.target.value.slice(1);
                          setUser({ ...user, adresa: capitalizedInput });
                        }}
                      />
                    </div>
                    <div className="mb-4 flex flex-col gap-6">
                      <button
                        onClick={modifyFullAdress}
                        className="buttonDeviceType"
                      >
                        Modify Data
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Checkbox
                    defaultChecked
                    ripple={true}
                    className="squared-full w-6 h-6 hover:before:opacity-0 hover:scale-105 bg-blue-gray-100/25 border-blue-gray-500/50 transition-all"
                    checked={user?.notificationSms}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        notificationSms: !user?.notificationSms,
                      });
                    }}
                    label="Notify by SMS"
                  />
                  <button
                    onClick={modifyNotifications}
                    className="buttonDeviceType"
                  >
                    Modify Notifications
                  </button>
                </div>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
