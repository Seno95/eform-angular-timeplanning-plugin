/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using TimePlanning.Pn.Infrastructure.Models.Settings;

namespace TimePlanning.Pn.Services.TimePlanningClockInService
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Infrastructure.Models.Flex.Index;
    using Infrastructure.Models.Flex.Update;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
    using Microting.TimePlanningBase.Infrastructure.Data;
    using Microting.TimePlanningBase.Infrastructure.Data.Entities;
    using TimePlanning.Pn.Infrastructure.Models.Clockin;
    using TimePlanning.Pn.Services.TimePlanningFlexService;
    using TimePlanningLocalizationService;


    /// <summary>
    /// TimePlanningFlexService
    /// </summary>
    public class TimePlanningClockInService : ITimePlanningClockInService
    {
        private readonly ILogger<TimePlanningClockInService> _logger;
        private readonly IPluginDbOptions<TimePlanningBaseSettings> _options;
        private readonly TimePlanningPnDbContext _dbContext;
        private readonly IUserService _userService;
        private readonly ITimePlanningLocalizationService _localizationService;
        private readonly IEFormCoreService _core;

        public TimePlanningClockInService(
            ILogger<TimePlanningClockInService> logger,
            TimePlanningPnDbContext dbContext,
            IUserService userService,
            ITimePlanningLocalizationService localizationService,
            IEFormCoreService core, IPluginDbOptions<TimePlanningBaseSettings> options)
        {
            _logger = logger;
            _dbContext = dbContext;
            _userService = userService;
            _localizationService = localizationService;
            _core = core;
            _options = options;
        }

        public async Task<OperationDataResult<List<TimePlanningClockInIndexModel>>> Index()
        {
            try
            {
                var core = await _core.GetCore();
                await using var sdkDbContext = core.DbContextHelper.GetDbContext();

                // Get distinct site IDs from plan registrations
                var listSiteIds = await _dbContext.PlanRegistrations
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => x.SdkSitId).Distinct().ToListAsync();

                List<PlanRegistration> planRegistrations = new List<PlanRegistration>();

                foreach (var listSiteId in listSiteIds)
                {
                    // Check for active registrations for today
                    var todayRegistration = await _dbContext.PlanRegistrations
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Date == DateTime.Now.Date && x.SdkSitId == listSiteId && x.Start1Id != 0)
                        .FirstOrDefaultAsync();

                    if (todayRegistration != null)
                    {
                        planRegistrations.Add(todayRegistration);
                        continue;
                    }

                    // If no active registration today, fetch the latest registration before today
                    var r = await _dbContext.PlanRegistrations
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .Where(x => x.Date < DateTime.Now.Date)
                        .Where(x => x.SdkSitId == listSiteId)
                        .OrderByDescending(x => x.Date).FirstOrDefaultAsync();

                    if (r != null)
                    {
                        if (r.Date == DateTime.Now.AddDays(-1).Date)
                        {
                            planRegistrations.Add(r);
                        }
                        else
                        {
                            PlanRegistration planRegistration = new PlanRegistration
                            {
                                Date = DateTime.Now.AddDays(-1).Date,
                                SdkSitId = r.SdkSitId,
                                SumFlexEnd = Math.Round(r.SumFlexEnd, 2),
                                PaiedOutFlex = r.PaiedOutFlex,
                                CommentOffice = r.CommentOffice
                            };
                            planRegistrations.Add(planRegistration);
                        }
                    }
                }

                var resultWorkers = new List<TimePlanningClockInIndexModel>();

                foreach (var planRegistration in planRegistrations)
                {
                    var site = await sdkDbContext.Sites.SingleOrDefaultAsync(x => x.MicrotingUid == planRegistration.SdkSitId && x.WorkflowState != Constants.WorkflowStates.Removed);
                    if (site == null)
                    {
                        continue;
                    }

                    bool isActive = IsWorkerActive(planRegistration);
                    DateTime? clockInTime = GetClockInTime(planRegistration);

                    resultWorkers.Add(new TimePlanningClockInIndexModel
                    {
                        SdkSiteId = planRegistration.SdkSitId,
                        Date = planRegistration.Date,
                        Worker = new CommonDictionaryModel
                        {
                            Id = planRegistration.SdkSitId,
                            Name = site.Name
                        },
                        SumFlex = Math.Round(planRegistration.SumFlexEnd, 2),
                        PaidOutFlex = planRegistration.PaiedOutFlex,
                        CommentOffice = planRegistration.CommentOffice?.Replace("\r", "<br />") ?? "",
                        IsActive = isActive,
                        ClockInTime = clockInTime
                    });
                }

                return new OperationDataResult<List<TimePlanningClockInIndexModel>>(
                    true,
                    resultWorkers);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationDataResult<List<TimePlanningClockInIndexModel>>(
                    false,
                    _localizationService.GetString("ErrorWhileObtainingPlannings"));
            }
        }

        private bool IsWorkerActive(PlanRegistration planRegistration)
        {
            return planRegistration.Date >= DateTime.Now.AddDays(-1).Date &&
                   planRegistration.Start1Id != 0 &&
                   (planRegistration.Stop1Id == 0 || planRegistration.Stop1Id == null);
        }


        private DateTime? GetClockInTime(PlanRegistration planRegistration)
        {
            if (planRegistration.Start1StartedAt.HasValue)
            {
                return planRegistration.Start1StartedAt;
            }
            else if (planRegistration.Start1Id != 0)
            {
                return planRegistration.Date.AddMinutes(5 * planRegistration.Start1Id);
            }

            return null;
        }




        public async Task<OperationResult> UpdateCreate(List<TimePlanningClockInUpdateModel> model)
        {
            try
            {
                foreach (var updateModel in model)
                {
                    var planRegistration = await _dbContext.PlanRegistrations
                        .Where(x => x.Date == updateModel.Date)
                        .Where(x => x.SdkSitId == updateModel.Worker.Id)
                        .FirstOrDefaultAsync();

                    if (planRegistration != null)
                    {
                        await UpdatePlanning(planRegistration, updateModel);
                    } else {
                        await CreatePlanning(updateModel, (int)updateModel.Worker.Id);
                    }
                }

                var listSiteIds = await _dbContext.PlanRegistrations
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                    .Select(x => x.SdkSitId).Distinct().ToListAsync();

                var maxHistoryDays = _options.Value.MaxHistoryDays == 0 ? null : _options.Value.MaxHistoryDays;
                var eFormId = _options.Value.InfoeFormId;
                var folderId = _options.Value.FolderId == 0 ? null : _options.Value.FolderId;
                var core = await _core.GetCore();
                await using var sdkDbContext = core.DbContextHelper.GetDbContext();
                foreach (int listSiteId in listSiteIds)
                {
                    var plannings = await _dbContext.PlanRegistrations
                        .Where(x => x.StatusCaseId != 0)
                        .Where(x => x.Date > DateTime.Now.AddDays(-2))
                        .Where(x => x.SdkSitId == listSiteId)
                        .ToListAsync();

                    foreach (PlanRegistration planRegistration in plannings)
                    {
                        var site = await sdkDbContext.Sites.SingleOrDefaultAsync(x => x.MicrotingUid == planRegistration.SdkSitId);
                        var language = await sdkDbContext.Languages.SingleAsync(x => x.Id == site.LanguageId);
                        Message _message =
                            await _dbContext.Messages.SingleOrDefaultAsync(x => x.Id == planRegistration.MessageId);
                        Console.WriteLine($"Updating planRegistration {planRegistration.Id} for date {planRegistration.Date}");
                        string theMessage;
                        switch (language.LanguageCode)
                        {
                            case "da":
                                theMessage = _message != null ? _message.DaName : "";
                                break;
                            case "de":
                                theMessage = _message != null ? _message.DeName : "";
                                break;
                            default:
                                theMessage = _message != null ? _message.EnName : "";
                                break;
                        }
                        await planRegistration.Update(_dbContext);
                    }
                }



                return new OperationResult(
                    true,
                    _localizationService.GetString("SuccessfullyCreateOrUpdatePlanning"));
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                _logger.LogError(e.Message);
                return new OperationResult(
                    false,
                    _localizationService.GetString("ErrorWhileUpdatePlanning"));
            }
        }

        private async Task CreatePlanning(TimePlanningClockInUpdateModel model, int sdkSiteId)
        {
            var planning = new PlanRegistration
            {

                SdkSitId = sdkSiteId,
                Date = model.Date,
                SumFlexEnd = model.SumFlexStart - model.PaidOutFlex,
                PaiedOutFlex = model.PaidOutFlex,
                CreatedByUserId = _userService.UserId,
                UpdatedByUserId = _userService.UserId
            };

            await planning.Create(_dbContext);
        }

        private async Task UpdatePlanning(PlanRegistration planRegistration,
            TimePlanningClockInUpdateModel model)
        {

            planRegistration.SumFlexEnd += planRegistration.PaiedOutFlex - model.PaidOutFlex;
            planRegistration.PaiedOutFlex = model.PaidOutFlex;
            planRegistration.UpdatedByUserId = _userService.UserId;

            await planRegistration.Update(_dbContext);
        }
    }
}