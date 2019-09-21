import {MigrationInterface, QueryRunner} from "typeorm";

export class Initialize1569040895398 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `todo` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(10) NOT NULL COMMENT 'todo のタイトル, 概要', `body` varchar(30) NULL COMMENT 'todo 補足やメモ' DEFAULT '', `deleteAt` timestamp NULL COMMENT '論理削除' DEFAULT null, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `todo`");
    }

}
