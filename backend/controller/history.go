package controller

import (
	"net/http"

	"github.com/arttiwa/sa-65-example/entity"
	"github.com/gin-gonic/gin"
)

// POST /historys
func CreateHistory(c *gin.Context) {
	var History entity.History
	var DMGLevel entity.DMGLevel
	var Cart entity.Cart
	var User entity.User

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 12 จะถูก bind เข้าตัวแปร History
	if err := c.ShouldBindJSON(&History); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13 ค้นหา DMGLevel ด้วย id
	if tx := entity.DB().Where("id = ?", History.DMGLevelID).First(&DMGLevel); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not found DMGLevel in History "})
		return
	}

	// 14: ค้นหา Cart ด้วย id
	if tx := entity.DB().Where("id = ?", History.CartID).First(&Cart); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not found Cart in History"})
		return
	}

	// x: ค้นหา User ด้วย id ขั้นตอนนี้ไม่จำเป็น เพราะมีการเช็คตั้งแต่ ขั้นตอนที่3
	if tx := entity.DB().Where("id = ?", History.UserID).First(&User); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "not found User"})
		return
	}
	// 15: สร้าง History
	rq := entity.History{
		Cause:    History.Cause,
		Solution: History.Solution,
		Price : History.Price,
		
		User:            User,
		DMGLevel: DMGLevel,
		Cart:         Cart,
	}

	// 16: บันทึก
	if err := entity.DB().Create(&rq).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": rq})
}

// GET /history/:id
func GetHistory(c *gin.Context) {
	var history entity.History
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM histories WHERE id = ?", id).Scan(&history).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": history})
}

// GET /historys
func ListHistorys(c *gin.Context) {
	var historys []entity.History
	if err := entity.DB().Preload("Cart").Preload("Cart.Request").Raw("SELECT * FROM histories").Find(&historys).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": historys})
}

// DELETE /historys/:id
func DeleteHistory(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM histories WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "history not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /historys
func UpdateHistory(c *gin.Context) {
	var history entity.History
	if err := c.ShouldBindJSON(&history); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if tx := entity.DB().Where("id = ?", history.ID).First(&history); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "history not found"})
		return
	}
	if err := entity.DB().Save(&history).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": history})
}
