package com.app.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.Period;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

@Entity
@Table(name = "el_medical")
public class MedicalInfo implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "name", columnDefinition = "VARCHAR(50)")
	private String name;
	
	@Column(name = "prenume", columnDefinition = "VARCHAR(50)")
	private String prenume;
	
	@Column(name = "username", columnDefinition = "VARCHAR(100)")
	private String username;
	
	@Column(name = "gender", columnDefinition = "VARCHAR(10)")
	private String gender;
	
	@Column(name = "grupa_sanguina", columnDefinition = "VARCHAR(4)")
	private String grupaSanguina;
	
	@Column(name = "boli_cronice", columnDefinition = "VARCHAR(100)")
	private boolean boliCronice;
	
	@Column(name = "email", columnDefinition = "VARCHAR(50)")
	private String email;
	
	@Column(name = "pacient_phone", columnDefinition = "VARCHAR(10)")
	private String pacientPhoneNumber;
	
	@Column(name = "height", columnDefinition = "VARCHAR(13)")
	private String height;
	
	@Column(name = "weight", columnDefinition = "VARCHAR(13)")
	private String weight;

	@Column(name = "CNP", columnDefinition = "VARCHAR(13)")
	private String cnp;
	
	@Column(name = "cetatenie", columnDefinition = "VARCHAR(100)")
	private String cetatenie;
	
	@Column(name = "tara", columnDefinition = "VARCHAR(50)")
	private String tara;
	
	@Column(name = "judet", columnDefinition = "VARCHAR(30)")
	private String judet;
	
	@Column(name = "localitate", columnDefinition = "VARCHAR(50)")
	private String localitate;
	
	@Column(name = "adresa", columnDefinition = "VARCHAR(500)")
	private String adresa;
	
	@Column(name = "birthday", columnDefinition = "VARCHAR(30)")
	private LocalDate birthday;
	
	@Column(name = "age", columnDefinition = "VARCHAR(5)")
	private Integer age;
	

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPrenume() {
		return prenume;
	}

	public void setPrenume(String prenume) {
		this.prenume = prenume;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getGrupaSanguina() {
		return grupaSanguina;
	}

	public void setGrupaSanguina(String grupaSanguina) {
		this.grupaSanguina = grupaSanguina;
	}

	public boolean isBoliCronice() {
		return boliCronice;
	}

	public void setBoliCronice(boolean boliCronice) {
		this.boliCronice = boliCronice;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPacientPhoneNumber() {
		return pacientPhoneNumber;
	}

	public void setPacientPhoneNumber(String pacientPhoneNumber) {
		this.pacientPhoneNumber = pacientPhoneNumber;
	}

	public String getHeight() {
		return height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public String getWeight() {
		return weight;
	}

	public void setWeight(String weight) {
		this.weight = weight;
	}
	
	public String getCnp() {
		return cnp;
	}

	public void setCnp(String cnp) {
		this.cnp = cnp;
	}

	public String getCetatenie() {
		return cetatenie;
	}

	public void setCetatenie(String cetatenie) {
		this.cetatenie = cetatenie;
	}

	public String getTara() {
		return tara;
	}

	public void setTara(String tara) {
		this.tara = tara;
	}

	public String getJudet() {
		return judet;
	}

	public void setJudet(String judet) {
		this.judet = judet;
	}

	public String getLocalitate() {
		return localitate;
	}

	public void setLocalitate(String localitate) {
		this.localitate = localitate;
	}

	public String getAdresa() {
		return adresa;
	}

	public void setAdresa(String adresa) {
		this.adresa = adresa;
	}

	public LocalDate getBirthday() {
		return birthday;
	}

	public void setBirthday(LocalDate birthday) {
		this.birthday = birthday;	
		calculateAge();
	}
	
	
	  public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	@PrePersist
	    public void calculateAge() {
	        if (birthday != null) {
	            LocalDate currentDate = LocalDate.now();
	            int calculatedAge = Period.between(birthday, currentDate).getYears();
	            setAge(calculatedAge);
	        }
	    }

	public MedicalInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public MedicalInfo(int id, String name, String prenume, String username, String gender, String grupaSanguina,
			boolean boliCronice, String email, String pacientPhoneNumber, String height, String weight, String cnp,
			String cetatenie, String tara, String judet, String localitate, String adresa, LocalDate birthday,
			Integer age) {
		super();
		this.id = id;
		this.name = name;
		this.prenume = prenume;
		this.username = username;
		this.gender = gender;
		this.grupaSanguina = grupaSanguina;
		this.boliCronice = boliCronice;
		this.email = email;
		this.pacientPhoneNumber = pacientPhoneNumber;
		this.height = height;
		this.weight = weight;
		this.cnp = cnp;
		this.cetatenie = cetatenie;
		this.tara = tara;
		this.judet = judet;
		this.localitate = localitate;
		this.adresa = adresa;
		this.birthday = birthday;
		this.age = age;
	}

	@Override
	public String toString() {
		return "MedicalInfo [id=" + id + ", name=" + name + ", prenume=" + prenume + ", username=" + username
				+ ", gender=" + gender + ", grupaSanguina=" + grupaSanguina + ", boliCronice=" + boliCronice
				+ ", email=" + email + ", pacientPhoneNumber=" + pacientPhoneNumber + ", height=" + height + ", weight="
				+ weight + ", cnp=" + cnp + ", cetatenie=" + cetatenie + ", tara=" + tara + ", judet=" + judet
				+ ", localitate=" + localitate + ", adresa=" + adresa + ", birthday=" + birthday + ", age=" + age + "]";
	}


}


