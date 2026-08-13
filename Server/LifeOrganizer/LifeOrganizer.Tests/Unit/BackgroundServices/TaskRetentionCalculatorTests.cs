using LifeOrganizer.Domain.Entities;
using LifeOrganizer.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace LifeOrganizer.Tests.Unit.BackgroundServices
{
    public class TaskRetentionCalculatorTests
    {
        private readonly ITestOutputHelper output;
        public TaskRetentionCalculatorTests(ITestOutputHelper output)
        {
            this.output = output;
        }

        [Fact]
        public void ShouldDelete_ShouldReturnFalse_WhenTaskIsNotCompleted()
        {
            var task = new TodoItem
            { 
                IsCompleted = false, 
                CompletedAt = null 
            };

            Assert.False(TaskRetentionCalculator.ShouldDelete(task, 30, DateTime.UtcNow));

            output.WriteLine("Verified that an incomplete task is not deleted.");
        }

        [Fact]
        public void ShouldDelete_ShouldReturnFalse_WhenWithinRetentionPeriod()
        {
            var task = new TodoItem 
            { 
                IsCompleted = true, 
                CompletedAt = DateTime.UtcNow.AddDays(-10) 
            };

            Assert.False(TaskRetentionCalculator.ShouldDelete(task, 30, DateTime.UtcNow));

            output.WriteLine("Verified that a completed task is not deleted when it is within the retention period.");
        }

        [Fact]
        public void ShouldDelete_ShouldReturnTrue_WhenPastRetentionPeriod()
        {
            var task = new TodoItem 
            { 
                IsCompleted = true, 
                CompletedAt = DateTime.UtcNow.AddDays(-40) 
            };

            Assert.True(TaskRetentionCalculator.ShouldDelete(task, 30, DateTime.UtcNow));

            output.WriteLine("Verified that a completed task is deleted when it is past the retention period.");
        }
    }
}
