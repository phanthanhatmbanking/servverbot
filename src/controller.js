class SimServer {
    constructor() {
        this.listRoom = {};
    }

    add(idRoom, phone) {
        this.listRoom[idRoom] = {
            phone: phone,
            lastcode: ''
        };
    }

    update(idRoom, phone) {
        // Cập nhật số điện thoại theo idRoom
        if (this.listRoom[idRoom]) {
            this.listRoom[idRoom].phone = phone;
        } else {
            console.log(`Phòng có id ${idRoom} không tồn tại.`);
        }
    }

    remove(idRoom) {
        // Xóa một phòng theo idRoom
        if (this.listRoom[idRoom]) {
            delete this.listRoom[idRoom];
        } else {
            console.log(`Phòng có id ${idRoom} không tồn tại.`);
        }
    }

    findOne(phone) {
        // Tìm phòng theo số điện thoại
        for (let idRoom in this.listRoom) {
            if (this.listRoom[idRoom].phone === phone) {
                return idRoom;
            }
        }
        return null;
    }

    findById(idRoom) {
        // Tìm phòng theo idRoom
        if (this.listRoom[idRoom]) {
            return this.listRoom[idRoom];
        } else {
            console.log(`Phòng có id ${idRoom} không tồn tại.`);
            return null;
        }
    }
}
module.exports = SimServer;