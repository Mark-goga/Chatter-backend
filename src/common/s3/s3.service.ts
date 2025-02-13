import {PutObjectCommand, S3Client, S3ClientConfig} from '@aws-sdk/client-s3';
import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {FileUploadOptionsInterface} from "./file-upload-options.interface";

@Injectable()
export class S3Service {
	private readonly client: S3Client;

	constructor(private readonly configService: ConfigService) {
		const accessKeyId = configService.get('AWS_ACCESS_KEY');
		const secretAccessKey = configService.get('AWS_SECRET_ACCESS_KEY');

		const clientConfig: S3ClientConfig = {};

		if (accessKeyId && secretAccessKey) {
			clientConfig.credentials = {
				accessKeyId,
				secretAccessKey,
			}
		}

		this.client = new S3Client(clientConfig);
	}

	async upload({key, file, bucket}: FileUploadOptionsInterface) {
		await this.client.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				Body: file,
			})
		)
	}

	getObjectUrl({bucket, key}: Pick<FileUploadOptionsInterface, 'key'| 'bucket'>) {
		return `https://${bucket}.s3.amazonaws.com/${key}`;
	}
}
