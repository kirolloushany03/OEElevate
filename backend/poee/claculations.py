
class Calculations:
    @staticmethod
    def calculate_availability(run_time, planned_production_time):
        return run_time / planned_production_time if planned_production_time else 0

    @staticmethod
    def calculate_performance(total_units, ideal_cycle_time, run_time):
        return (total_units * ideal_cycle_time) / run_time if run_time else 0

    @staticmethod
    def calculate_quality(good_units, total_units):
        return good_units / total_units if total_units else 0

    @staticmethod
    def calculate_oee(availability, performance, quality):
        return availability * performance * quality