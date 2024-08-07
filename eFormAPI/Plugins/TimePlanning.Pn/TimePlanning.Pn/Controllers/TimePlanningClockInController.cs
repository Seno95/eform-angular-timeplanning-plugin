namespace TimePlanning.Pn.Controllers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using TimePlanning.Pn.Infrastructure.Models.Clockin;
    using TimePlanning.Pn.Services.TimePlanningFlexService;

    [Route("api/time-planning-pn/clockin")]
    public class TimePlanningClockInController : ControllerBase
    {
        private readonly ITimePlanningClockInService _clockInService;

        public TimePlanningClockInController(ITimePlanningClockInService clockInService)
        {
            _clockInService = clockInService;
        }

        [HttpGet]
        [Route("index")]
        public async Task<OperationDataResult<List<TimePlanningClockInIndexModel>>> Index()
        {
            return await _clockInService.Index();
        }

        [HttpPut]
        public async Task<OperationResult> Update([FromBody] List<TimePlanningClockInUpdateModel> model)
        {
            return await _clockInService.UpdateCreate(model);
        }
    }
}

