from decimal import Decimal

HOTEL_NIGHTLY_RATE = {'Budget': Decimal('30'), 'Standard': Decimal('70'), 'Luxury': Decimal('180')}
GST_RATE = Decimal('0.05')
EMERGENCY_BUFFER_RATE = Decimal('0.10')


def calculate_budget(*, days, travelers, hotel_tier='Standard', food_per_day=Decimal('35'),
                      travel_cost=Decimal('400'), tickets=Decimal('150'), misc=Decimal('100')):
    """Mirrors the frontend's live budget calculator so the same numbers come back
    whether the calculation happens client-side or via POST /api/calculate-budget/."""

    days = Decimal(days)
    travelers = Decimal(travelers)
    food_per_day = Decimal(food_per_day)
    travel_cost = Decimal(travel_cost)
    tickets = Decimal(tickets)
    misc = Decimal(misc)

    hotel = HOTEL_NIGHTLY_RATE.get(hotel_tier, HOTEL_NIGHTLY_RATE['Standard']) * days
    food = food_per_day * days * travelers
    travel = travel_cost * travelers
    entry_tickets = tickets * travelers

    subtotal = hotel + food + travel + entry_tickets + misc
    gst = subtotal * GST_RATE
    emergency_fund = subtotal * EMERGENCY_BUFFER_RATE
    total = subtotal + gst + emergency_fund

    return {
        'hotel_cost': round(hotel, 2),
        'food_cost': round(food, 2),
        'travel_cost': round(travel, 2),
        'entry_tickets': round(entry_tickets, 2),
        'miscellaneous': round(misc, 2),
        'gst': round(gst, 2),
        'emergency_fund': round(emergency_fund, 2),
        'subtotal': round(subtotal, 2),
        'total': round(total, 2),
    }
