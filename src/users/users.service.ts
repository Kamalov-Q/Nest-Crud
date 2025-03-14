import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ username: createUserDto.username });
    if (existingUser) {
      return { user: null, message: "User already exists", success: false };
    }
    const newUser = new this.userModel(createUserDto);
    await newUser.save();
    return { user: newUser, message: "User created successfully", success: true };
  }

  async findAll() {
    const allUsers = await this.userModel.find();
    return {
      users: allUsers,
      message: "Users found successfully",
      success: true,
      count: allUsers.length
    };
  }

  async findOne(id: string) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid ID");
    }

    try {
      const userOne = await this.userModel.findOne({ _id: id });
      if (!userOne) {
        return new HttpException("User does not exist", 404);
      }
      return {
        user: userOne,
        message: "User found successfully",
        success: true
      }
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException("User " + id + " does not exist");
    }
    // const updatedUser  = await existingUser.updateOne(updateUserDto);
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!updatedUser) {
      throw new BadRequestException("Invalid ID");
    }
    return { user: updatedUser, message: "User updated successfully", success: true };
  }

  async remove(id: string): Promise<{ user: User, message: string, success: boolean }> {
    const existingUser = await this.userModel.findById(id);

    if (!existingUser) {
      throw new NotFoundException("User " + id + " does not exist");
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new BadRequestException("Invalid ID");
    }
    return { user: deletedUser, message: "User deleted successfully", success: true };

  }
}
