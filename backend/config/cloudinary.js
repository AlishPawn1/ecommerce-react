import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: 'dbcjvgzpk',
        api_key: '242246242585393',
        api_secret: 'JMd6MBTCHmsdWJKpCgPjb1uVOuU',
    });
};

export default connectCloudinary;
