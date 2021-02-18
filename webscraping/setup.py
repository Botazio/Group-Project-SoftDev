from setuptools import setup

setup(name="dbikes",
      version="0.1",
      description="Web Scraping for Dublin Bikes application",
      url="",
      author="Alvaro Garcia",
      author_email="alvaro.garcia@ucdconnect.ie",
      packages=['dbikes'],
      entry_points={
          'console_scripts': ['webscraping_dbikes=dbikes.main:main']
      }
      )
