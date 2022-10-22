package entity

import (
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {

	return db

}

func SetupDatabase() {

	database, err := gorm.Open(sqlite.Open("sa-65.db"), &gorm.Config{})

	if err != nil {

		panic("failed to connect database")

	}

	// Migrate the schema

	database.AutoMigrate(
		&Role{},
		&Gender{},
		&Position{},
		&JobType{},
		&Distributor{},
		&Building{},
		&Room{},
		&User{},
		&Device{},
		&Room_has_Device{},
		&Request{},
		&Cart{},
		&History{},
		&DMGLevel{},
		&Estimate{}, // 15
		&Brand{},
		&Type{},
	)

	db = database

	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)

	db.Model(&Role{}).Create(&Role{Name: "User"})
	db.Model(&Role{}).Create(&Role{Name: "Tech"})
	db.Model(&Role{}).Create(&Role{Name: "Admin"})
	db.Model(&Gender{}).Create(&Gender{Name: "Male"})
	db.Model(&Gender{}).Create(&Gender{Name: "Female"})
	db.Model(&Position{}).Create(&Position{Position: "A"})
	db.Model(&Position{}).Create(&Position{Position: "B"})
	db.Model(&Distributor{}).Create(&Distributor{Name: "ร้านA", Location: ".."})
	db.Model(&Distributor{}).Create(&Distributor{Name: "ร้านB", Location: ".."})
	db.Model(&Brand{}).Create(&Brand{Name: "Brand A"})
	db.Model(&Brand{}).Create(&Brand{Name: "Brand B"})
	db.Model(&Type{}).Create(&Type{Name: "คอม"})
	db.Model(&Type{}).Create(&Type{Name: "notebook"})
	db.Model(&Estimate{}).Create(&Estimate{Name: "esA"})
	db.Model(&Estimate{}).Create(&Estimate{Name: "esB"})

	var male, female Gender
	db.Raw("SELECT * FROM genders WHERE name = ?", "Male").Scan(&male)
	db.Raw("SELECT * FROM genders WHERE name = ?", "Female").Scan(&female)

	var r_user, r_tech, r_admin Role
	db.Raw("SELECT * FROM roles WHERE name = ?", "User").Scan(&r_user)
	db.Raw("SELECT * FROM roles WHERE name = ?", "Tech").Scan(&r_tech)
	db.Raw("SELECT * FROM roles WHERE name = ?", "Admin").Scan(&r_admin)

	var position Position
	db.Raw("SELECT * FROM Positions WHERE Position = ?", "A").Scan(&position)

	db.Model(&User{}).Create(&User{
		Name:         "Test",
		Email:        "test",
		Phone_number: "0555555555",
		Password:     string(password),
		Role:         r_user,
		Gender:       male,
		Position:     position,
	})

	db.Model(&User{}).Create(&User{
		Name:         "Test01",
		Email:        "test01",
		Phone_number: "0555555551",
		Password:     string(password),
		Role:         r_tech,
		Gender:       female,
		Position:     position,
	})

	var user User
	db.Raw("SELECT * FROM users WHERE email = ?", "test").Scan(&user)

	db.Model(&Building{}).Create(&Building{Name: "ตึกA"})
	db.Model(&Building{}).Create(&Building{Name: "ตึกB"})

	var buildingA, buildingB Building
	db.Raw("SELECT * FROM buildings WHERE name = ?", "ตึกA").Scan(&buildingA)
	db.Raw("SELECT * FROM buildings WHERE name = ?", "ตึกB").Scan(&buildingB)

	db.Model(&Room{}).Create(&Room{Name: "ห้องA", Building: buildingA})
	db.Model(&Room{}).Create(&Room{Name: "ห้องB", Building: buildingB})
	db.Model(&Room{}).Create(&Room{Name: "ห้องA1", Building: buildingA})
	db.Model(&Room{}).Create(&Room{Name: "ห้องB1", Building: buildingB})

	var roomA, roomB Room
	db.Raw("SELECT * FROM rooms WHERE name = ?", "ห้องA").Scan(&roomA)
	db.Raw("SELECT * FROM rooms WHERE name = ?", "ห้องB").Scan(&roomB)

	db.Model(&JobType{}).Create(&JobType{Name: "ซ่อมคอม"})
	db.Model(&JobType{}).Create(&JobType{Name: "ซ่อมรถ"})

	var brandA, brandB Brand
	db.Raw("SELECT * FROM brands WHERE name = ?", "Brand A").Scan(&brandA)
	db.Raw("SELECT * FROM brands WHERE name = ?", "Brand B").Scan(&brandB)

	var typeA, typeB Type
	db.Raw("SELECT * FROM types WHERE name = ?", "คอม").Scan(&typeA)
	db.Raw("SELECT * FROM types WHERE name = ?", "notebook").Scan(&typeB)

	var distributoreA, distributoreB Distributor
	db.Raw("SELECT * FROM Distributors WHERE name = ?", "ร้านA").Scan(&distributoreA)
	db.Raw("SELECT * FROM Distributors WHERE name = ?", "ร้านB").Scan(&distributoreB)

	db.Model(&Device{}).Create(&Device{
		Brand:       brandA,
		Type:        typeA,
		Distributor: distributoreA,
	})
	db.Model(&Device{}).Create(&Device{
		Brand:       brandB,
		Type:        typeA,
		Distributor: distributoreA,
	})
	db.Model(&Device{}).Create(&Device{
		Brand:       brandA,
		Type:        typeB,
		Distributor: distributoreA,
	})
	db.Model(&Device{}).Create(&Device{
		Brand:       brandA,
		Type:        typeA,
		Distributor: distributoreB,
	})

	var deviceA, deviceB, deviceA1 Device
	db.Raw("SELECT * FROM devices WHERE id = ?", "1").Scan(&deviceA)
	db.Raw("SELECT * FROM devices WHERE id = ?", "2").Scan(&deviceB)
	db.Raw("SELECT * FROM devices WHERE id = ?", "3").Scan(&deviceA1)

	db.Model(&Room_has_Device{}).Create(&Room_has_Device{
		User:   user,
		Device: deviceA,
		Room:   roomA,
	})
	db.Model(&Room_has_Device{}).Create(&Room_has_Device{
		User:   user,
		Device: deviceB,
		Room:   roomA,
	})
	db.Model(&Room_has_Device{}).Create(&Room_has_Device{
		User:   user,
		Device: deviceA1,
		Room:   roomB,
	})

	// มีการ add ข้อมูล user RHD Device แค่นั้น (รวม Entityลูกด้วยนะ เช่น role Gender อะไรแบบนี้)

	var rhdA, rhdB Room_has_Device
	db.Raw("SELECT * FROM Room_has_Devices WHERE id = ?", "1").Scan(&rhdA)
	db.Raw("SELECT * FROM Room_has_Devices WHERE id = ?", "2").Scan(&rhdB)

	var jtA, jtB JobType
	db.Raw("SELECT * FROM Job_Types WHERE name = ?", "ซ่อมคอม").Scan(&jtA)
	db.Raw("SELECT * FROM Job_Types WHERE name = ?", "ซ่อมรถ").Scan(&jtB)

	db.Model(&Request{}).Create(&Request{
		Explain:         "เปิดไม่ติด",
		User:            user,
		JobType:         jtA,
		Room_has_Device: rhdA,
	})
	db.Model(&Request{}).Create(&Request{
		Explain:         "เปิดไม่ติดA",
		User:            user,
		JobType:         jtA,
		Room_has_Device: rhdA,
	})
	db.Model(&Request{}).Create(&Request{
		Explain:         "เปิดไม่ติดB",
		User:            user,
		JobType:         jtA,
		Room_has_Device: rhdA,
	})

	var requestA,requestB,requestC Request
	db.Raw("SELECT * FROM requests WHERE id = ?", "1").Scan(&requestA)
	db.Raw("SELECT * FROM requests WHERE id = ?", "2").Scan(&requestB)
	db.Raw("SELECT * FROM requests WHERE id = ?", "3").Scan(&requestC)

	var esA, esB Estimate
	db.Raw("SELECT * FROM Estimates WHERE name = ?", "esA").Scan(&esA)
	db.Raw("SELECT * FROM Estimates WHERE name = ?", "esB").Scan(&esB)

	db.Model(&Cart{}).Create(&Cart{
		User:     user,
		Estimate: esA,
		Request:  requestA,
	})
	db.Model(&Cart{}).Create(&Cart{
		User:     user,
		Estimate: esB,
		Request:  requestB,
	})
	db.Model(&Cart{}).Create(&Cart{
		User:     user,
		Estimate: esA,
		Request:  requestC,
	})
	db.Model(&DMGLevel{}).Create(&DMGLevel{DMGLevel: "ซ่อมได้"})
	db.Model(&DMGLevel{}).Create(&DMGLevel{DMGLevel: "ต้องเปลี่ยนอุปกรณ์บางส่วน"})
	db.Model(&DMGLevel{}).Create(&DMGLevel{DMGLevel: "ไม่สามารถซ่อมได้"})

}
