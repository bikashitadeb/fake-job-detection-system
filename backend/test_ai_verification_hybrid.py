import unittest

from app.services.ai_verification import (
    fee_request_detected,
    predict_fake_job,
    salary_check,
)
from app.services.linkedin_verification import verify_company


class HybridJobVerificationTests(unittest.TestCase):
    def evaluate(self, job):
        company_verification = verify_company(job["company"])
        job["company_verified"] = company_verification["verified"]
        job["company_score"] = company_verification["score"]
        job["linkedin_url"] = job.get("linkedin_url") or company_verification["linkedin_url"]
        return predict_fake_job(job)

    def test_suspicious_fee_language_is_detected_without_flagging_a_fee_disclaimer(self):
        payment_text = f"{chr(0x20b9)}2,500 registration/security payment"
        self.assertTrue(fee_request_detected(payment_text))
        self.assertTrue(fee_request_detected("Applicants must pay a registration fee."))
        self.assertTrue(fee_request_detected("Applicants must pay a security fee."))
        self.assertTrue(fee_request_detected("A registration fee is required."))
        self.assertFalse(
            fee_request_detected("No application or registration fees are charged.")
        )

    def test_salary_parser_flags_extreme_weekly_pay_but_not_normal_salary_formats(self):
        self.assertTrue(salary_check("", f"{chr(0x20b9)}1,00,000+ per week"))
        self.assertTrue(salary_check("", f"{chr(0x20b9)}100000/week"))
        self.assertTrue(salary_check("Earn one lakh every week."))
        self.assertFalse(
            salary_check(
                "",
                f"{chr(0x20b9)}40,000\u2013{chr(0x20b9)}60,000 per month",
            )
        )
        self.assertFalse(salary_check("", f"{chr(0x20b9)}12\u201318 LPA"))
        self.assertFalse(salary_check("", f"{chr(0x20b9)}6 LPA"))
        self.assertFalse(salary_check("", f"{chr(0x20b9)}15,000/month"))
        self.assertFalse(salary_check("", f"{chr(0x20b9)}35\u201345 LPA"))

    def test_suspicious_job_is_high_risk_even_when_xgboost_predicts_legitimate(self):
        job = {
            "title": f"Financial Consultant \u2014 Earn {chr(0x20b9)}1 Lakh Weekly",
            "company": "Fast Money Careers",
            "location": "Bengaluru",
            "salary": f"{chr(0x20b9)}1,00,000+ per week",
            "description": (
                f"Earn {chr(0x20b9)}1 lakh every week. Simple online tasks. "
                "Work only 1\u20132 hours/day. Guaranteed income. Immediate hiring. "
                f"{chr(0x20b9)}2,500 registration/security payment."
            ),
            "requirements": "No experience required. Smartphone, internet connection.",
            "website": "",
            "official_email": "fastmoneycareers@gmail.com",
            "linkedin_url": "",
        }

        result = self.evaluate(job)
        signal_codes = {signal["code"] for signal in result["risk_signals"]}
        detected_text = " ".join(result["suspicious_keywords"])

        self.assertFalse(result["xgboost_prediction"])
        self.assertTrue(result["is_fake"])
        self.assertEqual(result["risk_level"], "HIGH")
        self.assertGreaterEqual(result["risk_score"], 70)
        self.assertTrue(result["salary_anomaly"])
        self.assertAlmostEqual(result["trust_score"] + result["risk_score"], 100)
        self.assertIn("upfront_fee_request", signal_codes)
        self.assertIn("guaranteed_income", signal_codes)
        self.assertIn("extreme_recurring_salary", signal_codes)
        self.assertIn("low_effort_high_return", signal_codes)
        self.assertIn("immediate_hiring", signal_codes)
        self.assertIn("unverified_company", signal_codes)
        self.assertIn("missing_company_website", signal_codes)
        self.assertIn("missing_linkedin", signal_codes)
        self.assertIn("personal_email_provider", signal_codes)
        self.assertIn("no experience required", detected_text)
        self.assertIn("extreme earnings promise", detected_text)
        self.assertIn("very short work hours", detected_text)

    def test_legitimate_job_with_normal_salary_stays_low_risk(self):
        job = {
            "title": "Senior Software Engineer",
            "company": "Google",
            "location": "Bengaluru",
            "salary": f"{chr(0x20b9)}35\u201345 LPA",
            "description": (
                "Build backend services, review code, and collaborate with product teams. "
                "Compensation is discussed through the official careers site. "
                "No application or registration fees are charged."
            ),
            "requirements": "Bachelor degree and 5 years of Python experience.",
            "website": "https://careers.google.com",
            "official_email": "careers@google.com",
            "linkedin_url": "https://www.linkedin.com/company/google/",
        }

        result = self.evaluate(job)

        self.assertFalse(result["is_fake"])
        self.assertEqual(result["risk_level"], "LOW")
        self.assertLess(result["risk_score"], 40)
        self.assertFalse(result["salary_anomaly"])
        self.assertNotIn("upfront_fee_request", {s["code"] for s in result["risk_signals"]})

    def test_missing_employer_details_alone_do_not_flag_an_ordinary_job(self):
        result = predict_fake_job({
            "title": "Accounts Assistant",
            "company": "Small Local Business",
            "location": "Pune",
            "salary": f"{chr(0x20b9)}30,000/month",
            "description": (
                "Prepare monthly reports, maintain invoices, and assist the finance team."
            ),
            "requirements": "Two years of accounting experience and spreadsheet skills.",
            "company_verified": False,
            "company_score": 0,
            "website": "",
            "official_email": "",
            "linkedin_url": "",
        })

        self.assertFalse(result["is_fake"])
        self.assertLess(result["risk_score"], 70)
        self.assertFalse(result["salary_anomaly"])
        signal_codes = {signal["code"] for signal in result["risk_signals"]}
        self.assertTrue({
            "unverified_company",
            "missing_company_website",
            "missing_official_email",
            "missing_linkedin",
        }.issubset(signal_codes))


if __name__ == "__main__":
    unittest.main()
