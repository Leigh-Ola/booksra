"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundJobsModule = void 0;
const common_1 = require("@nestjs/common");
const background_jobs_controller_1 = require("./background-jobs.controller");
const background_jobs_service_1 = require("./background-jobs.service");
const purchases_module_1 = require("../purchases/purchases.module");
let BackgroundJobsModule = class BackgroundJobsModule {
};
exports.BackgroundJobsModule = BackgroundJobsModule;
exports.BackgroundJobsModule = BackgroundJobsModule = __decorate([
    (0, common_1.Module)({
        imports: [purchases_module_1.PurchasesModule],
        controllers: [background_jobs_controller_1.BackgroundJobsController],
        providers: [background_jobs_service_1.BackgroundJobsService],
    })
], BackgroundJobsModule);
//# sourceMappingURL=background-jobs.module.js.map