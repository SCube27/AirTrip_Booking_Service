const { Logger } = require("../config");
const { NotFoundError } = require("../errors");

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async delete(data) {
        const response = await this.model.destroy({
            where: {
                id: data,
            }
        });
        if(!response) {
            Logger.error(`The data ${response} has not been found in database, to be deleted`);
            throw new NotFoundError(response, "Requested data is not found!");
        }
        return response;
    }

    async get(data) {
        const response = await this.model.findByPk(data);

        if(!response) {
            Logger.error(`The data has not been found in database for the ID ${data}`);
            throw new NotFoundError(response, "Requested data is not found!");
        }

        return response;
    }

    async getAll() {
        const response = await this.model.findAll();
        return response;
    }

    async update(id, data) {
        const airplane = await this.model.findByPk(id);

        if(!airplane) {
            Logger.error(`The data has not been found in database for the ID ${id}`);
            throw new NotFoundError(response, "Requested data is not found and not updated!");
        }

        const response = await this.model.update(data, {
            where: {
                id: id
            }
        });

        return response;
    }
}

module.exports = CrudRepository;