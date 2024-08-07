using Microting.eFormApi.BasePn.Infrastructure.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimePlanning.Pn.Infrastructure.Models.Clockin
{
    public class TimePlanningClockInIndexModel
    {
        public int SdkSiteId { get; set; }
        public DateTime Date { get; set; }
        public CommonDictionaryModel Worker { get; set; }
        public double SumFlex { get; set; }
        public double PaidOutFlex { get; set; }
        public string CommentOffice { get; set; }
    }
}
